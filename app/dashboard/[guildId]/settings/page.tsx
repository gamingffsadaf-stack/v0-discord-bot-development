import { createClient } from "@/lib/supabase/server"
import { NeonCard } from "@/components/dashboard/neon-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ guildId: string }>
}) {
  const { guildId } = await params
  const supabase = await createClient()

  const { data: guild } = await supabase.from("guilds").select("*").eq("id", guildId).single()

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-primary neon-glow">Settings</h1>
        </div>

        <div className="space-y-6">
          <NeonCard title="General Settings" glowColor="cyan">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prefix">Command Prefix</Label>
                <Input id="prefix" defaultValue={guild?.prefix || "!"} className="glass-card border-primary/20 mt-2" />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  defaultValue={guild?.language || "bn"}
                  className="glass-card border-primary/20 mt-2"
                />
              </div>
            </div>
          </NeonCard>

          <NeonCard title="Features" glowColor="magenta">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Replies</Label>
                  <p className="text-sm text-muted-foreground">Enable automatic replies to trigger words</p>
                </div>
                <Switch defaultChecked={guild?.auto_reply_enabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>DM Protection</Label>
                  <p className="text-sm text-muted-foreground">Protect users from spam DMs</p>
                </div>
                <Switch defaultChecked={guild?.dm_protection_enabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profanity Filter</Label>
                  <p className="text-sm text-muted-foreground">Automatically filter bad words</p>
                </div>
                <Switch defaultChecked={guild?.profanity_filter_enabled} />
              </div>
            </div>
          </NeonCard>

          <Button className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
