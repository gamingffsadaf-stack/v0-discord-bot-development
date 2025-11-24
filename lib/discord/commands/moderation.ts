import { type ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js"
import { createClient } from "@/lib/supabase/server"

export const moderationCommand = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderation commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Kick a user from the server")
        .addUserOption((option) => option.setName("user").setDescription("User to kick").setRequired(true))
        .addStringOption((option) => option.setName("reason").setDescription("Reason for kicking").setRequired(false)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("Ban a user from the server")
        .addUserOption((option) => option.setName("user").setDescription("User to ban").setRequired(true))
        .addStringOption((option) => option.setName("reason").setDescription("Reason for banning").setRequired(false))
        .addIntegerOption((option) =>
          option
            .setName("delete_days")
            .setDescription("Days of messages to delete (0-7)")
            .setMinValue(0)
            .setMaxValue(7),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unban")
        .setDescription("Unban a user from the server")
        .addStringOption((option) => option.setName("user_id").setDescription("User ID to unban").setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("timeout")
        .setDescription("Timeout a user")
        .addUserOption((option) => option.setName("user").setDescription("User to timeout").setRequired(true))
        .addIntegerOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration in minutes")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(40320),
        )
        .addStringOption((option) => option.setName("reason").setDescription("Reason for timeout").setRequired(false)),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === "kick") {
      await handleKick(interaction)
    } else if (subcommand === "ban") {
      await handleBan(interaction)
    } else if (subcommand === "unban") {
      await handleUnban(interaction)
    } else if (subcommand === "timeout") {
      await handleTimeout(interaction)
    }
  },
}

async function handleKick(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetUser = interaction.options.getUser("user", true)
  const reason = interaction.options.getString("reason") || "No reason provided"
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const member = await guild.members.fetch(targetUser.id).catch(() => null)

  if (!member) {
    await interaction.editReply("User not found in this server.")
    return
  }

  if (!member.kickable) {
    await interaction.editReply("I cannot kick this user.")
    return
  }

  try {
    await member.kick(reason)

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("User Kicked")
      .setDescription(`**User:** ${targetUser.tag}\n` + `**Reason:** ${reason}`)
      .setFooter({ text: `Kicked by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to database
    const supabase = await createClient()
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "KICK",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      target_user_id: targetUser.id,
      target_user_tag: targetUser.tag,
      reason,
    })
  } catch (error) {
    await interaction.editReply("Failed to kick user.")
  }
}

async function handleBan(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetUser = interaction.options.getUser("user", true)
  const reason = interaction.options.getString("reason") || "No reason provided"
  const deleteDays = interaction.options.getInteger("delete_days") || 0
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  try {
    await guild.members.ban(targetUser.id, {
      reason,
      deleteMessageSeconds: deleteDays * 24 * 60 * 60,
    })

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("User Banned")
      .setDescription(
        `**User:** ${targetUser.tag}\n` + `**Reason:** ${reason}\n` + `**Messages Deleted:** Last ${deleteDays} day(s)`,
      )
      .setFooter({ text: `Banned by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to database
    const supabase = await createClient()
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "BAN",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      target_user_id: targetUser.id,
      target_user_tag: targetUser.tag,
      reason,
      details: { delete_days: deleteDays },
    })
  } catch (error) {
    await interaction.editReply("Failed to ban user.")
  }
}

async function handleUnban(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const userId = interaction.options.getString("user_id", true)
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  try {
    await guild.members.unban(userId)

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("User Unbanned")
      .setDescription(`**User ID:** ${userId}`)
      .setFooter({ text: `Unbanned by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to database
    const supabase = await createClient()
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "UNBAN",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      target_user_id: userId,
    })
  } catch (error) {
    await interaction.editReply("Failed to unban user.")
  }
}

async function handleTimeout(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetUser = interaction.options.getUser("user", true)
  const duration = interaction.options.getInteger("duration", true)
  const reason = interaction.options.getString("reason") || "No reason provided"
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild) {
    await interaction.editReply("This command can only be used in a server.")
    return
  }

  const member = await guild.members.fetch(targetUser.id).catch(() => null)

  if (!member) {
    await interaction.editReply("User not found in this server.")
    return
  }

  if (!member.moderatable) {
    await interaction.editReply("I cannot timeout this user.")
    return
  }

  try {
    const timeoutUntil = new Date(Date.now() + duration * 60 * 1000)
    await member.timeout(duration * 60 * 1000, reason)

    const embed = new EmbedBuilder()
      .setColor("#ff9900")
      .setTitle("User Timed Out")
      .setDescription(
        `**User:** ${targetUser.tag}\n` +
          `**Duration:** ${duration} minute(s)\n` +
          `**Reason:** ${reason}\n` +
          `**Until:** <t:${Math.floor(timeoutUntil.getTime() / 1000)}:F>`,
      )
      .setFooter({ text: `Timed out by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log to database
    const supabase = await createClient()
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "TIMEOUT",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      target_user_id: targetUser.id,
      target_user_tag: targetUser.tag,
      reason,
      details: { duration_minutes: duration },
    })
  } catch (error) {
    await interaction.editReply("Failed to timeout user.")
  }
}
