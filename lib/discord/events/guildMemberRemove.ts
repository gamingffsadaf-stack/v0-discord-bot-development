import { type GuildMember, EmbedBuilder, type PartialGuildMember } from "discord.js"
import { createClient } from "@/lib/supabase/server"

export async function handleGuildMemberRemove(member: GuildMember | PartialGuildMember) {
  const guild = member.guild
  const supabase = await createClient()

  // Get guild config
  const { data: guildConfig } = await supabase.from("guilds").select("*").eq("id", guild.id).single()

  if (!guildConfig || !guildConfig.log_channel_id) return

  const logChannel = guild.channels.cache.get(guildConfig.log_channel_id)

  if (!logChannel || !logChannel.isTextBased()) return

  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle("Member Left")
    .setDescription(
      `**User:** ${member.user?.tag || "Unknown"}\n` + `**ID:** ${member.id}\n` + `**Members:** ${guild.memberCount}`,
    )
    .setThumbnail(member.user?.displayAvatarURL() || "")
    .setTimestamp()

  await logChannel.send({ embeds: [embed] })

  // Log the leave
  await supabase.from("mod_logs").insert({
    guild_id: guild.id,
    action_type: "MEMBER_LEAVE",
    moderator_id: "system",
    moderator_tag: "System",
    target_user_id: member.id,
    target_user_tag: member.user?.tag || "Unknown",
  })
}
