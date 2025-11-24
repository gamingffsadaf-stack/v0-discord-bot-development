import { createClient } from "@/lib/supabase/server"
import { NeonCard } from "@/components/dashboard/neon-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function WarningsPage({
  params,
}: {
  params: Promise<{ guildId: string }>
}) {
  const { guildId } = await params
  const supabase = await createClient()

  const { data: warnings } = await supabase
    .from("warnings")
    .select("*")
    .eq("guild_id", guildId)
    .order("created_at", { ascending: false })

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
          <h1 className="text-4xl font-bold text-primary neon-glow">Warnings</h1>
        </div>

        <NeonCard title="All Warnings" glowColor="magenta">
          <div className="space-y-4">
            {warnings && warnings.length > 0 ? (
              warnings.map((warning) => (
                <div key={warning.id} className="border-b border-border/50 pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{warning.user_tag}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="text-destructive">Reason:</span> {warning.reason}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Warned by {warning.moderator_tag} • {new Date(warning.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No warnings found.</p>
            )}
          </div>
        </NeonCard>
      </div>
    </div>
  )
}
