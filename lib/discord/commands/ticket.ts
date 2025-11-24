import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import { createClient } from "@/lib/supabase/server"

export const ticketCommand = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Manage support tickets")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new support ticket")
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason for creating the ticket").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) => subcommand.setName("close").setDescription("Close the current ticket")),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === "create") {
      await handleTicketCreate(interaction)
    } else if (subcommand === "close") {
      await handleTicketClose(interaction)
    }
  },
}

async function handleTicketCreate(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const reason = interaction.options.getString("reason", true)
  const guild = interaction.guild
  const user = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  // Get guild config
  const { data: guildConfig } = await supabase.from("guilds").select("*").eq("id", guild.id).single()

  if (!guildConfig) {
    await interaction.editReply("Server configuration not found.")
    return
  }

  // Check if user already has an open ticket
  const { data: existingTicket } = await supabase
    .from("tickets")
    .select("*")
    .eq("guild_id", guild.id)
    .eq("user_id", user.id)
    .eq("status", "open")
    .single()

  if (existingTicket) {
    await interaction.editReply(`You already have an open ticket: <#${existingTicket.channel_id}>`)
    return
  }

  // Increment ticket counter
  const newTicketNumber = guildConfig.ticket_counter + 1
  await supabase.from("guilds").update({ ticket_counter: newTicketNumber }).eq("id", guild.id)

  // Create ticket channel
  const ticketChannel = await guild.channels.create({
    name: `ticket-${newTicketNumber}`,
    type: ChannelType.GuildText,
    parent: guildConfig.ticket_category_id || undefined,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
    ],
  })

  // Save ticket to database
  await supabase.from("tickets").insert({
    guild_id: guild.id,
    channel_id: ticketChannel.id,
    ticket_number: newTicketNumber,
    user_id: user.id,
    user_tag: user.tag,
    category: reason,
  })

  // Send welcome message in ticket channel
  const embed = new EmbedBuilder()
    .setColor("#00ffff")
    .setTitle(`Ticket #${newTicketNumber}`)
    .setDescription(
      `**Reason:** ${reason}\n\nThank you for contacting support! A staff member will be with you shortly.`,
    )
    .setFooter({ text: `Created by ${user.tag}` })
    .setTimestamp()

  const closeButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("close_ticket").setLabel("Close Ticket").setStyle(ButtonStyle.Danger),
  )

  await ticketChannel.send({
    content: `<@${user.id}>`,
    embeds: [embed],
    components: [closeButton],
  })

  await interaction.editReply(`Ticket created! Please check <#${ticketChannel.id}>`)

  // Log the action
  await supabase.from("mod_logs").insert({
    guild_id: guild.id,
    action_type: "TICKET_CREATE",
    moderator_id: user.id,
    moderator_tag: user.tag,
    details: { ticket_number: newTicketNumber, reason },
  })
}

async function handleTicketClose(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const channel = interaction.channel
  const guild = interaction.guild
  const user = interaction.user

  if (!guild || !channel) {
    await interaction.editReply("This command can only be used in a server ticket channel.")
    return
  }

  const supabase = await createClient()

  // Check if this is a ticket channel
  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("channel_id", channel.id)
    .eq("status", "open")
    .single()

  if (!ticket) {
    await interaction.editReply("This is not an open ticket channel.")
    return
  }

  // Close the ticket
  await supabase
    .from("tickets")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      closed_by: user.id,
    })
    .eq("id", ticket.id)

  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle("Ticket Closed")
    .setDescription(`This ticket has been closed by ${user.tag}`)
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })

  // Delete channel after 5 seconds
  setTimeout(async () => {
    await channel.delete()
  }, 5000)

  // Log the action
  await supabase.from("mod_logs").insert({
    guild_id: guild.id,
    action_type: "TICKET_CLOSE",
    moderator_id: user.id,
    moderator_tag: user.tag,
    target_user_id: ticket.user_id,
    details: { ticket_number: ticket.ticket_number },
  })
}
