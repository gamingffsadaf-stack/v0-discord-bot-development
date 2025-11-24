import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "./dashboard-client"
import { BotStatus } from "@/components/dashboard/bot-status"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get all guilds from database
  const { data: guilds } = await supabase.from("guilds").select("*").order("name")

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary neon-glow mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your Discord servers with SadafGuard</p>
          </div>
        </div>

        <div className="mb-6">
          <BotStatus />
        </div>

        <DashboardClient guilds={guilds || []} />
      </div>
    </div>
  )
}
