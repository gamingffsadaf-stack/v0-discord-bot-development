import { createClient } from "@/lib/supabase/server"
import { NeonCard } from "@/components/dashboard/neon-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function LogsPage({
  params,
}: {
  params: Promise<{ guildId: string }>
}) {
  const { guildId } = await params
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from("mod_logs")
    .select("*")
    .eq("guild_id", guildId)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-primary neon-glow">Moderation Logs</h1>
        </div>

        <NeonCard title="Recent Activity" glowColor="purple">
          <div className="space-y-3">
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="border-b border-border/50 pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{log.action_type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        <span className="text-primary">{log.moderator_tag}</span>
                        {log.target_user_tag && (
                          <>
                            {" "}
                            → <span className="text-secondary">{log.target_user_tag}</span>
                          </>
                        )}
                      </p>
                      {log.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {log.reason}</p>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No logs found.</p>
            )}
          </div>
        </NeonCard>
      </div>
    </div>
  )
}
