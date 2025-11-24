import { createClient } from "@/lib/supabase/server"
import { NeonCard } from "@/components/dashboard/neon-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ guildId: string }>
}) {
  const { guildId } = await params
  const supabase = await createClient()

  const { data: tickets } = await supabase
    .from("tickets")
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
          <h1 className="text-4xl font-bold text-primary neon-glow">Tickets</h1>
        </div>

        <NeonCard title="All Tickets" glowColor="cyan">
          <div className="space-y-4">
            {tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">Ticket #{ticket.ticket_number}</span>
                      <Badge variant={ticket.status === "open" ? "default" : "secondary"}>{ticket.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ticket.user_tag} • {ticket.category || "General"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No tickets found.</p>
            )}
          </div>
        </NeonCard>
      </div>
    </div>
  )
}
