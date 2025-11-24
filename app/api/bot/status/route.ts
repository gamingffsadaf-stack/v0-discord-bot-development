import { NextResponse } from "next/server"
import { validateDiscordConfig } from "@/lib/discord/config"

export async function GET() {
  const status = {
    configured: false,
    missingVars: [] as string[],
    ready: false,
  }

  try {
    validateDiscordConfig()
    status.configured = true
    status.ready = true
  } catch (error) {
    if (error instanceof Error) {
      const match = error.message.match(/Missing required Discord environment variables: (.+)/)
      if (match) {
        status.missingVars = match[1].split(", ")
      }
    }
  }

  return NextResponse.json(status)
}
