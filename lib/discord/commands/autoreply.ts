import { type ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js"
import { createClient } from "@/lib/supabase/server"

export const autoreplyCommand = {
  data: new SlashCommandBuilder()
    .setName("autoreply")
    .setDescription("Manage auto-replies")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add an auto-reply")
        .addStringOption((option) => option.setName("trigger").setDescription("Trigger text").setRequired(true))
        .addStringOption((option) => option.setName("reply").setDescription("Reply text").setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove an auto-reply")
        .addStringOption((option) => option.setName("id").setDescription("Auto-reply ID").setRequired(true)),
    )
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("List all auto-replies"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("toggle")
        .setDescription("Enable or disable auto-replies")
        .addBooleanOption((option) => option.setName("enabled").setDescription("Enable or disable").setRequired(true)),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === "add") {
      await handleAutoReplyAdd(interaction)
    } else if (subcommand === "remove") {
      await handleAutoReplyRemove(interaction)
    } else if (subcommand === "list") {
      await handleAutoReplyList(interaction)
    } else if (subcommand === "toggle") {
      await handleAutoReplyToggle(interaction)
    }
  },
}

async function handleAutoReplyAdd(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const trigger = interaction.options.getString("trigger", true)
  const reply = interaction.options.getString("reply", true)
  const guild = interaction.guild

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("auto_replies")
    .insert({
      guild_id: guild.id,
      trigger_text: trigger.toLowerCase(),
      reply_text: reply,
    })
    .select()
    .single()

  if (error) {
    await interaction.editReply("Failed to add auto-reply.")
    return
  }

  const embed = new EmbedBuilder()
    .setColor("#00ff00")
    .setTitle("Auto-Reply Added")
    .setDescription(`**Trigger:** ${trigger}\n` + `**Reply:** ${reply}\n` + `**ID:** ${data.id}`)
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })
}

async function handleAutoReplyRemove(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const id = interaction.options.getString("id", true)
  const guild = interaction.guild

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  const { error } = await supabase.from("auto_replies").delete().eq("id", id).eq("guild_id", guild.id)

  if (error) {
    await interaction.editReply("Failed to remove auto-reply.")
    return
  }

  await interaction.editReply("Auto-reply removed successfully!")
}

async function handleAutoReplyList(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const guild = interaction.guild

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  const { data: autoReplies } = await supabase
    .from("auto_replies")
    .select("*")
    .eq("guild_id", guild.id)
    .order("created_at", { ascending: false })

  if (!autoReplies || autoReplies.length === 0) {
    await interaction.editReply("No auto-replies configured.")
    return
  }

  const embed = new EmbedBuilder()
    .setColor("#00ffff")
    .setTitle("Auto-Replies")
    .setDescription(`Total: ${autoReplies.length} auto-reply(ies)`)
    .setTimestamp()

  autoReplies.slice(0, 10).forEach((ar, index) => {
    embed.addFields({
      name: `#${index + 1} - ${ar.enabled ? "✅" : "❌"}`,
      value: `**Trigger:** ${ar.trigger_text}\n` + `**Reply:** ${ar.reply_text}\n` + `**ID:** ${ar.id}`,
      inline: false,
    })
  })

  await interaction.editReply({ embeds: [embed] })
}

async function handleAutoReplyToggle(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const enabled = interaction.options.getBoolean("enabled", true)
  const guild = interaction.guild

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  const { error } = await supabase.from("guilds").update({ auto_reply_enabled: enabled }).eq("id", guild.id)

  if (error) {
    await interaction.editReply("Failed to update auto-reply settings.")
    return
  }

  await interaction.editReply(`Auto-replies ${enabled ? "enabled" : "disabled"}!`)
}
