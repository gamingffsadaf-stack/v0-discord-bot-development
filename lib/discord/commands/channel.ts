import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} from "discord.js"
import { createClient } from "@/lib/supabase/server"

export const channelCommand = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Channel management commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lock")
        .setDescription("Lock a channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to lock (current channel if not specified)")
            .addChannelTypes(ChannelType.GuildText),
        )
        .addStringOption((option) => option.setName("reason").setDescription("Reason for locking")),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unlock")
        .setDescription("Unlock a channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to unlock (current channel if not specified)")
            .addChannelTypes(ChannelType.GuildText),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("slowmode")
        .setDescription("Set channel slowmode")
        .addIntegerOption((option) =>
          option
            .setName("seconds")
            .setDescription("Slowmode duration in seconds (0 to disable)")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(21600),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to set slowmode (current channel if not specified)")
            .addChannelTypes(ChannelType.GuildText),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === "lock") {
      await handleChannelLock(interaction)
    } else if (subcommand === "unlock") {
      await handleChannelUnlock(interaction)
    } else if (subcommand === "slowmode") {
      await handleSlowmode(interaction)
    }
  },
}

async function handleChannelLock(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetChannel = interaction.options.getChannel("channel") || interaction.channel
  const reason = interaction.options.getString("reason") || "No reason provided"
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild || !targetChannel || targetChannel.type !== ChannelType.GuildText) {
    await interaction.editReply("Invalid channel.")
    return
  }

  try {
    // Lock channel by removing Send Messages permission for @everyone
    await targetChannel.permissionOverwrites.edit(guild.roles.everyone, {
      SendMessages: false,
    })

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("Channel Locked")
      .setDescription(`**Channel:** <#${targetChannel.id}>\n` + `**Reason:** ${reason}`)
      .setFooter({ text: `Locked by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Save to database
    const supabase = await createClient()
    await supabase.from("locked_channels").insert({
      guild_id: guild.id,
      channel_id: targetChannel.id,
      channel_name: targetChannel.name,
      locked_by: moderator.id,
      reason,
      status: "locked",
    })

    // Log the action
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "CHANNEL_LOCK",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      reason,
      details: { channel_id: targetChannel.id, channel_name: targetChannel.name },
    })
  } catch (error) {
    await interaction.editReply("Failed to lock channel.")
  }
}

async function handleChannelUnlock(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const targetChannel = interaction.options.getChannel("channel") || interaction.channel
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild || !targetChannel || targetChannel.type !== ChannelType.GuildText) {
    await interaction.editReply("Invalid channel.")
    return
  }

  try {
    // Unlock channel by restoring Send Messages permission for @everyone
    await targetChannel.permissionOverwrites.edit(guild.roles.everyone, {
      SendMessages: null, // Reset to default
    })

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("Channel Unlocked")
      .setDescription(`**Channel:** <#${targetChannel.id}>`)
      .setFooter({ text: `Unlocked by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Update database
    const supabase = await createClient()
    await supabase
      .from("locked_channels")
      .update({
        status: "unlocked",
        unlocked_by: moderator.id,
        unlocked_at: new Date().toISOString(),
      })
      .eq("guild_id", guild.id)
      .eq("channel_id", targetChannel.id)
      .eq("status", "locked")

    // Log the action
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "CHANNEL_UNLOCK",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      details: { channel_id: targetChannel.id, channel_name: targetChannel.name },
    })
  } catch (error) {
    await interaction.editReply("Failed to unlock channel.")
  }
}

async function handleSlowmode(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply()

  const seconds = interaction.options.getInteger("seconds", true)
  const targetChannel = interaction.options.getChannel("channel") || interaction.channel
  const guild = interaction.guild
  const moderator = interaction.user

  if (!guild || !targetChannel || targetChannel.type !== ChannelType.GuildText) {
    await interaction.editReply("Invalid channel.")
    return
  }

  try {
    await targetChannel.setRateLimitPerUser(seconds)

    const embed = new EmbedBuilder()
      .setColor("#00ffff")
      .setTitle("Slowmode Updated")
      .setDescription(
        `**Channel:** <#${targetChannel.id}>\n` +
          `**Slowmode:** ${seconds === 0 ? "Disabled" : `${seconds} second(s)`}`,
      )
      .setFooter({ text: `Set by ${moderator.tag}` })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })

    // Log the action
    const supabase = await createClient()
    await supabase.from("mod_logs").insert({
      guild_id: guild.id,
      action_type: "SLOWMODE",
      moderator_id: moderator.id,
      moderator_tag: moderator.tag,
      details: {
        channel_id: targetChannel.id,
        channel_name: targetChannel.name,
        seconds,
      },
    })
  } catch (error) {
    await interaction.editReply("Failed to set slowmode.")
  }
}
