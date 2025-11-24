"use client"

import { useState } from "react"
import { ServerSelector } from "@/components/dashboard/server-selector"
import { StatCard } from "@/components/dashboard/stat-card"
import { NeonCard } from "@/components/dashboard/neon-card"
import { Ticket, AlertTriangle, Users, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Guild {
  id: string
  name: string
  icon: string | null
}

interface DashboardClientProps {
  guilds: Guild[]
}

export function DashboardClient({ guilds }: DashboardClientProps) {
  const [selectedServer, setSelectedServer] = useState<Guild | null>(guilds[0] || null)

  if (guilds.length === 0) {
    return (
      <NeonCard title="No Servers Found">
        <p className="text-muted-foreground mb-4">
          You haven't set up any servers yet. Run <code>/setup</code> in your Discord server to get started.
        </p>
      </NeonCard>
    )
  }

  return (
    <>
      <div className="mb-8 max-w-md">
        <ServerSelector servers={guilds} selectedServer={selectedServer} onSelectServer={setSelectedServer} />
      </div>

      {selectedServer && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Open Tickets"
              value="12"
              icon={Ticket}
              trend={{ value: 15, label: "from last week" }}
              glowColor="cyan"
            />
            <StatCard
              title="Active Warnings"
              value="8"
              icon={AlertTriangle}
              trend={{ value: -10, label: "from last week" }}
              glowColor="magenta"
            />
            <StatCard
              title="Total Members"
              value="1,247"
              icon={Users}
              trend={{ value: 5, label: "from last week" }}
              glowColor="purple"
            />
            <StatCard
              title="Mod Actions"
              value="45"
              icon={Activity}
              trend={{ value: 20, label: "from last week" }}
              glowColor="cyan"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <NeonCard title="Quick Actions" glowColor="cyan">
              <div className="grid grid-cols-2 gap-4">
                <Link href={`/dashboard/${selectedServer.id}/tickets`}>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Tickets
                  </Button>
                </Link>
                <Link href={`/dashboard/${selectedServer.id}/warnings`}>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Warnings
                  </Button>
                </Link>
                <Link href={`/dashboard/${selectedServer.id}/logs`}>
                  <Button className="w-full bg-transparent" variant="outline">
                    Mod Logs
                  </Button>
                </Link>
                <Link href={`/dashboard/${selectedServer.id}/settings`}>
                  <Button className="w-full bg-transparent" variant="outline">
                    Settings
                  </Button>
                </Link>
              </div>
            </NeonCard>

            <NeonCard title="Recent Activity" glowColor="magenta">
              <div className="space-y-4">
                <ActivityItem action="Ticket Created" user="User#1234" time="2 minutes ago" />
                <ActivityItem action="User Warned" user="BadUser#5678" time="15 minutes ago" />
                <ActivityItem action="Channel Locked" user="Mod#9012" time="1 hour ago" />
              </div>
            </NeonCard>
          </div>
        </>
      )}
    </>
  )
}

function ActivityItem({
  action,
  user,
  time,
}: {
  action: string
  user: string
  time: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{action}</p>
        <p className="text-xs text-muted-foreground">{user}</p>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  )
}
