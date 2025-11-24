import type { Message } from "discord.js"
import { createClient } from "@/lib/supabase/server"

const PROFANITY_WORDS = [
  "badword1",
  "badword2",
  "badword3", // Add Bengali and English profanity words
  "fuck",
  "shit",
  "ass",
  "bitch",
  // Add Bengali profanity words here
]

export async function handleMessageCreate(message: Message) {
  // Ignore bot messages
  if (message.author.bot) return

  const guild = message.guild
  if (!guild) return

  const supabase = await createClient()

  // Get guild config
  const { data: guildConfig } = await supabase.from("guilds").select("*").eq("id", guild.id).single()

  if (!guildConfig) return

  // Auto-Reply System
  if (guildConfig.auto_reply_enabled) {
    await handleAutoReply(message, guildConfig.id)
  }

  // Profanity Filter
  if (guildConfig.profanity_filter_enabled) {
    await handleProfanityFilter(message, guild.id)
  }
}

async function handleAutoReply(message: Message, guildId: string) {
  const supabase = await createClient()

  const { data: autoReplies } = await supabase
    .from("auto_replies")
    .select("*")
    .eq("guild_id", guildId)
    .eq("enabled", true)

  if (!autoReplies || autoReplies.length === 0) return

  const messageContent = message.content.toLowerCase()

  for (const autoReply of autoReplies) {
    if (messageContent.includes(autoReply.trigger_text)) {
      await message.reply(autoReply.reply_text)
      break // Only reply once per message
    }
  }
}

async function handleProfanityFilter(message: Message, guildId: string) {
  const messageContent = message.content.toLowerCase()

  // Check for profanity
  const hasProfanity = PROFANITY_WORDS.some((word) => messageContent.includes(word.toLowerCase()))

  if (hasProfanity) {
    try {
      // Delete the message
      await message.delete()

      // Warn the user
      await message.channel.send(`${message.author}, please watch your language! Profanity is not allowed.`)

      // Log the action
      const supabase = await createClient()
      await supabase.from("mod_logs").insert({
        guild_id: guildId,
        action_type: "PROFANITY_FILTER",
        moderator_id: "system",
        moderator_tag: "AutoMod",
        target_user_id: message.author.id,
        target_user_tag: message.author.tag,
        reason: "Profanity detected",
        details: {
          message_content: message.content.substring(0, 100),
          channel_id: message.channelId,
        },
      })
    } catch (error) {
      console.error("[v0] Error handling profanity:", error)
    }
  }
}
