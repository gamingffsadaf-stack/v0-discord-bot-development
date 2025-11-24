"use client"

import { useEffect, useState } from "react"
import { NeonCard } from "./neon-card"
import { Bot, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BotStatus {
  configured: boolean
  missingVars: string[]
  ready: boolean
}

export function BotStatus() {
  const [status, setStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    try {
      const res = await fetch("/api/bot/status")
      const data = await res.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch bot status:", error)
    } finally {
      setLoading(false)
    }
  }

  async function startBot() {
    setStarting(true)
    try {
      const res = await fetch("/api/bot/start", { method: "POST" })
      const data = await res.json()

      if (res.ok) {
        await fetchStatus()
      } else {
        alert(data.error || "Failed to start bot")
      }
    } catch (error) {
      alert("Failed to start bot")
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <NeonCard className="p-6">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary animate-pulse" />
          <div>
            <h3 className="text-lg font-bold text-foreground">Checking Bot Status...</h3>
          </div>
        </div>
      </NeonCard>
    )
  }

  if (!status?.configured) {
    return (
      <NeonCard className="p-6 border-accent">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-8 h-8 text-accent flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">Bot Not Configured</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Missing required environment variables. Please add them in the Vars section:
            </p>
            <ul className="text-sm text-accent space-y-1 mb-4">
              {status.missingVars.map((varName) => (
                <li key={varName} className="font-mono">
                  • {varName}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/your-repo#setup-instructions" target="_blank" rel="noopener noreferrer">
                View Setup Guide
              </a>
            </Button>
          </div>
        </div>
      </NeonCard>
    )
  }

  return (
    <NeonCard className="p-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2">Bot Configured</h3>
          <p className="text-sm text-muted-foreground mb-4">
            All environment variables are set. The bot is ready to start.
          </p>
          <Button onClick={startBot} disabled={starting} className="neon-border">
            {starting ? "Starting..." : "Start Bot"}
          </Button>
        </div>
      </div>
    </NeonCard>
  )
}
