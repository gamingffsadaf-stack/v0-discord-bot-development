import { type ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from "discord.js"
import { createClient } from "@/lib/supabase/server"

export const setupCommand = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const guild = interaction.guild

    if (!guild) {
      await interaction.editReply("This command can only be used in a server.")
      return
    }

    const supabase = await createClient()

    // Check if guild already exists
    const { data: existingGuild } = await supabase.from("guilds").select("*").eq("id", guild.id).single()

    if (existingGuild) {
      await interaction.editReply("Server is already configured!")
      return
    }

    // Create ticket category
    const ticketCategory = await guild.channels.create({
      name: "Tickets",
      type: ChannelType.GuildCategory,
    })

    // Create log channel
    const logChannel = await guild.channels.create({
      name: "bot-logs",
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ],
    })

    // Insert guild config
    await supabase.from("guilds").insert({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
      owner_id: guild.ownerId,
      log_channel_id: logChannel.id,
      ticket_category_id: ticketCategory.id,
    })

    await interaction.editReply(
      `Setup complete!\n\n` +
        `**Log Channel:** <#${logChannel.id}>\n` +
        `**Ticket Category:** ${ticketCategory.name}\n\n` +
        `You can now use the bot commands!`,
    )
  },
}
