import { type GuildMember, EmbedBuilder } from "discord.js"
import { createClient } from "@/lib/supabase/server"

export async function handleGuildMemberAdd(member: GuildMember) {
  const guild = member.guild
  const supabase = await createClient()

  // Get guild config
  const { data: guildConfig } = await supabase.from("guilds").select("*").eq("id", guild.id).single()

  if (!guildConfig || !guildConfig.welcome_channel_id) return

  const welcomeChannel = guild.channels.cache.get(guildConfig.welcome_channel_id)

  if (!welcomeChannel || !welcomeChannel.isTextBased()) return

  const embed = new EmbedBuilder()
    .setColor("#00ff00")
    .setTitle("Welcome!")
    .setDescription(
      `Welcome to **${guild.name}**, ${member.user}!\n\n` +
        `You are member #${guild.memberCount}\n\n` +
        `Please read the rules and enjoy your stay!`,
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp()

  await welcomeChannel.send({ embeds: [embed] })

  // Log the join
  await supabase.from("mod_logs").insert({
    guild_id: guild.id,
    action_type: "MEMBER_JOIN",
    moderator_id: "system",
    moderator_tag: "System",
    target_user_id: member.id,
    target_user_tag: member.user.tag,
  })
}
