import { Client, GatewayIntentBits, Partials } from "discord.js"

export function createDiscordClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildModeration,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
  })

  return client
}
