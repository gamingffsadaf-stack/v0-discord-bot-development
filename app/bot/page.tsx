"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { NeonCard } from "@/components/dashboard/neon-card"
import { Bot, Play, StopCircle, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function BotRunnerPage() {
  const [botStatus, setBotStatus] = useState<"stopped" | "running" | "loading">("loading")
  const [isConfigured, setIsConfigured] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    checkBotStatus()
  }, [])

  const checkBotStatus = async () => {
    try {
      const response = await fetch("/api/bot/start")
      const data = await response.json()
      setBotStatus(data.status)
      setIsConfigured(data.configured)
      addLog(`Bot status: ${data.status}`)
    } catch (error) {
      console.error("[v0] Error checking bot status:", error)
      addLog("Error checking bot status")
    }
  }

  const startBot = async () => {
    setIsStarting(true)
    setError(null)
    addLog("Starting bot...")

    try {
      const response = await fetch("/api/bot/start", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setBotStatus("running")
        addLog("Bot started successfully!")
      } else {
        setError(data.error || "Failed to start bot")
        addLog(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("[v0] Error starting bot:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage)
      addLog(`Error: ${errorMessage}`)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Bot className="w-10 h-10 text-primary" />
            Bot Control Panel
          </h1>
          <p className="text-muted-foreground">Start and monitor your Discord bot</p>
        </div>

        {/* Status Card */}
        <NeonCard className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  botStatus === "running"
                    ? "bg-green-500/20"
                    : botStatus === "stopped"
                      ? "bg-red-500/20"
                      : "bg-yellow-500/20"
                }`}
              >
                {botStatus === "running" ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : botStatus === "stopped" ? (
                  <XCircle className="w-8 h-8 text-red-400" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Bot Status: {botStatus.charAt(0).toUpperCase() + botStatus.slice(1)}
                </h2>
                <p className="text-muted-foreground">
                  Configuration: {isConfigured ? "Ready" : "Missing environment variables"}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={startBot}
              disabled={!isConfigured || botStatus === "running" || isStarting}
              className="neon-border"
            >
              {isStarting ? (
                <>Loading...</>
              ) : botStatus === "running" ? (
                <>
                  <StopCircle className="w-5 h-5 mr-2" />
                  Running
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Bot
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 font-semibold">Error</p>
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {!isConfigured && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 font-semibold">Configuration Required</p>
              <p className="text-yellow-300">
                Please add the required environment variables in the Vars section of the sidebar.
              </p>
            </div>
          )}
        </NeonCard>

        {/* Logs Card */}
        <NeonCard>
          <h3 className="text-xl font-bold text-foreground mb-4">Bot Logs</h3>
          <div className="bg-black/40 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No logs yet. Start the bot to see logs.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </NeonCard>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <NeonCard className="cursor-pointer hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all">
            <h4 className="font-bold text-foreground mb-2">Database Setup</h4>
            <p className="text-sm text-muted-foreground">Run migration scripts to set up tables</p>
          </NeonCard>
          <NeonCard className="cursor-pointer hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all">
            <h4 className="font-bold text-foreground mb-2">Bot Configuration</h4>
            <p className="text-sm text-muted-foreground">View and edit bot settings</p>
          </NeonCard>
        </div>
      </div>
    </div>
  )
}
