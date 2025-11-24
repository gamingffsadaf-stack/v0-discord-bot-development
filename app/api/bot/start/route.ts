import { NextResponse } from "next/server"
import { createDiscordClient } from "@/lib/discord/client"
import { DISCORD_CONFIG, validateDiscordConfig } from "@/lib/discord/config"
import { handleReady } from "@/lib/discord/events/ready"
import { handleInteractionCreate } from "@/lib/discord/events/interactionCreate"
import { handleMessageCreate } from "@/lib/discord/events/messageCreate"
import { handleGuildMemberAdd } from "@/lib/discord/events/guildMemberAdd"
import { handleGuildMemberRemove } from "@/lib/discord/events/guildMemberRemove"

let botStarted = false

export async function POST() {
  if (botStarted) {
    return NextResponse.json({ message: "Bot is already running" })
  }

  try {
    validateDiscordConfig()
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid configuration" },
      { status: 500 },
    )
  }

  try {
    const client = createDiscordClient()

    client.once("ready", () => handleReady(client))
    client.on("interactionCreate", handleInteractionCreate)
    client.on("messageCreate", handleMessageCreate)
    client.on("guildMemberAdd", handleGuildMemberAdd)
    client.on("guildMemberRemove", handleGuildMemberRemove)

    await client.login(DISCORD_CONFIG.token)

    botStarted = true

    return NextResponse.json({ message: "Bot started successfully" })
  } catch (error) {
    console.error("Error starting bot:", error)
    return NextResponse.json({ error: "Failed to start bot" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: botStarted ? "running" : "stopped",
    configured: Boolean(process.env.DISCORD_BOT_TOKEN),
  })
}
