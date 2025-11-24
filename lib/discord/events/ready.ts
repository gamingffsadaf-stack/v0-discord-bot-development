import { type Client, REST, Routes } from "discord.js"
import { ticketCommand } from "../commands/ticket"
import { setupCommand } from "../commands/setup"
import { warnCommand } from "../commands/warn"
import { moderationCommand } from "../commands/moderation"
import { channelCommand } from "../commands/channel"
import { roleCommand } from "../commands/role"
import { autoreplyCommand } from "../commands/autoreply"

export async function handleReady(client: Client) {
  console.log(`[v0] Bot is ready! Logged in as ${client.user?.tag}`)

  const commands = [
    ticketCommand.data.toJSON(),
    setupCommand.data.toJSON(),
    warnCommand.data.toJSON(),
    moderationCommand.data.toJSON(),
    channelCommand.data.toJSON(),
    roleCommand.data.toJSON(),
    autoreplyCommand.data.toJSON(),
  ]

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!)

  try {
    console.log("[v0] Started refreshing application (/) commands.")

    await rest.put(Routes.applicationCommands(client.user!.id), { body: commands })

    console.log("[v0] Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error("[v0] Error refreshing commands:", error)
  }
}
