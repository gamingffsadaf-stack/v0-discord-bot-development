import { type ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js"
import { createClient } from "@/lib/supabase/server"

export const warnCommand = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Manage user warnings")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Warn a user")
        .addUserOption((option) => option.setName("user").setDescription("User to warn").setRequired(true))
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason for the warning").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List warnings for a user")
        .addUserOption((option) =>
          option.setName("user").setDescription("User to check warnings for").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a warning")
        .addStringOption((option) =>
          option.setName("warning_id").setDescription("ID of the warning to remove").setRequired(true),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === "add") {
      await handleWarnAdd(interaction)
    } else if (subcommand === "list") {
      await handleWarnList(interaction)
    } else if (subcommand === "remove") {
      await handleWarnRemove(interaction)
    }
  },
}

async function handleWarnAdd(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetUser = interaction.options.getUser("user", true)
  const reason = interaction.options.getString("reason", true)
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  // Add warning to database
  const { data: warning, error } = await supabase
    .from("warnings")
    .insert({
      guild_id: guild.id,
      user_id: targetUser.id,
      user_tag: targetUser.tag,
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      reason,
    })
    .select()
    .single()

  if (error) {
    await interaction.editReply("Failed to add warning.")
    return
  }

  // Get total warnings for user
  const { count } = await supabase
    .from("warnings")
    .select("*", { count: "exact", head: true })
    .eq("guild_id", guild.id)
    .eq("user_id", targetUser.id)

  const embed = new EmbedBuilder()
    .setColor("#ff9900")
    .setTitle("User Warned")
    .setDescription(
      `**User:** ${targetUser.tag}\n` +
        `**Reason:** ${reason}\n` +
        `**Total Warnings:** ${count || 1}\n` +
        `**Warning ID:** ${warning.id}`,
    )
    .setFooter({ text: `Warned by ${moderator.tag}` })
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })

  // Try to DM the user
  try {
    const dmEmbed = new EmbedBuilder()
      .setColor("#ff9900")
      .setTitle(`You have been warned in ${guild.name}`)
      .setDescription(`**Reason:** ${reason}\n**Total Warnings:** ${count || 1}`)
      .setTimestamp()

    await targetUser.send({ embeds: [dmEmbed] })
  } catch {
    // User has DMs disabled
  }

  // Log the action
  await supabase.from("mod_logs").insert({
    guild_id: guild.id,
    action_type: "WARN",
    moderator_id: moderator.id,
    moderator_tag: moderator.tag,
    target_user_id: targetUser.id,
    target_user_tag: targetUser.tag,
    reason,
    details: { warning_id: warning.id, total_warnings: count || 1 },
  })
}

async function handleWarnList(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetUser = interaction.options.getUser("user", true)
  const guild = interaction.guild

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  const { data: warnings } = await supabase
    .from("warnings")
    .select("*")
    .eq("guild_id", guild.id)
    .eq("user_id", targetUser.id)
    .order("created_at", { ascending: false })

  if (!warnings || warnings.length === 0) {
    await interaction.editReply(`${targetUser.tag} has no warnings.`)
    return
  }

  const embed = new EmbedBuilder()
    .setColor("#ff9900")
    .setTitle(`Warnings for ${targetUser.tag}`)
    .setDescription(`Total: ${warnings.length} warning(s)`)
    .setTimestamp()

  warnings.slice(0, 10).forEach((warning, index) => {
    const date = new Date(warning.created_at).toLocaleDateString()
    embed.addFields({
      name: `#${index + 1} - ${date}`,
      value: `**Reason:** ${warning.reason}\n` + `**Moderator:** ${warning.moderator_tag}\n` + `**ID:** ${warning.id}`,
      inline: false,
    })
  })

  await interaction.editReply({ embeds: [embed] })
}

async function handleWarnRemove(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const warningId = interaction.options.getString("warning_id", true)
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const supabase = await createClient()

  // Get warning details before deleting
  const { data: warning } = await supabase
    .from("warnings")
    .select("*")
    .eq("id", warningId)
    .eq("guild_id", guild.id)
    .single()

  if (!warning) {
    await interaction.editReply("Warning not found.")
    return
  }

  // Delete warning
  const { error } = await supabase.from("warnings").delete().eq("id", warningId)

  if (error) {
    await interaction.editReply("Failed to remove warning.")
    return
  }

  const embed = new EmbedBuilder()
    .setColor("#00ff00")
    .setTitle("Warning Removed")
    .setDescription(
      `**User:** ${warning.user_tag}\n` + `**Original Reason:** ${warning.reason}\n` + `**Warning ID:** ${warning.id}`,
    )
    .setFooter({ text: `Removed by ${moderator.tag}` })
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })

  // Log the action
  await supabase.from("mod_logs").insert({
    guild_id: guild.id,
    action_type: "WARN_REMOVE",
    moderator_id: moderator.id,
    moderator_tag: moderator.tag,
    target_user_id: warning.user_id,
    target_user_tag: warning.user_tag,
    details: { warning_id: warningId, original_reason: warning.reason },
  })
}
