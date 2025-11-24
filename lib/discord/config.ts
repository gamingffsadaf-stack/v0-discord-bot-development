// Discord Bot Configuration
export const DISCORD_CONFIG = {
  token: process.env.DISCORD_BOT_TOKEN!,
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  inviteUrl: process.env.NEXT_PUBLIC_DISCORD_BOT_INVITE_URL!,
} as const

// Validate that all required environment variables are present
export function validateDiscordConfig() {
  const missing: string[] = []

  if (!DISCORD_CONFIG.token) missing.push("DISCORD_BOT_TOKEN")
  if (!DISCORD_CONFIG.clientId) missing.push("DISCORD_CLIENT_ID")
  if (!DISCORD_CONFIG.clientSecret) missing.push("DISCORD_CLIENT_SECRET")

  if (missing.length > 0) {
    throw new Error(
      `Missing required Discord environment variables: ${missing.join(", ")}\n\n` +
        "Please add these variables in the Vars section of the sidebar.",
    )
  }
}

// Bot permissions required
export const BOT_PERMISSIONS = {
  ADMINISTRATOR: 0x0000000000000008n,
  MANAGE_CHANNELS: 0x0000000000000010n,
  MANAGE_ROLES: 0x0000000010000000n,
  KICK_MEMBERS: 0x0000000000000002n,
  BAN_MEMBERS: 0x0000000000000004n,
  MODERATE_MEMBERS: 0x0000040000000000n,
  MANAGE_MESSAGES: 0x0000000000002000n,
  SEND_MESSAGES: 0x0000000000000800n,
  VIEW_CHANNEL: 0x0000000000000400n,
} as const
