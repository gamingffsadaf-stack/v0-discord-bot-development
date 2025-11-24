import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, ExternalLink } from "lucide-react"
import { NeonCard } from "@/components/dashboard/neon-card"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SadafGuard Setup
          </h1>
          <p className="text-slate-300 text-lg">Follow these steps to get your Discord bot running</p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <NeonCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">1. Environment Variables Configured</h3>
                <p className="text-slate-300 mb-3">
                  Your Discord bot credentials have been successfully added to the project.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    DISCORD_BOT_TOKEN
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    DISCORD_CLIENT_ID
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    DISCORD_CLIENT_SECRET
                  </span>
                </div>
              </div>
            </div>
          </NeonCard>

          {/* Step 2 */}
          <NeonCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Circle className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">2. Run Database Scripts</h3>
                <p className="text-slate-300 mb-3">
                  Execute the SQL migration scripts to create the necessary database tables.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-cyan-500/20 mb-3">
                  <code className="text-cyan-300 text-sm">
                    scripts/001_create_guilds_table.sql
                    <br />
                    scripts/002_create_tickets_table.sql
                    <br />
                    scripts/003_create_warnings_table.sql
                    <br />
                    scripts/004_create_logs_table.sql
                    <br />
                    scripts/005_create_auto_replies_table.sql
                    <br />
                    scripts/006_create_locked_channels_table.sql
                  </code>
                </div>
                <p className="text-sm text-slate-400">Run these in v0 or through the Supabase SQL editor.</p>
              </div>
            </div>
          </NeonCard>

          {/* Step 3 */}
          <NeonCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Circle className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">3. Invite Bot to Your Server</h3>
                <p className="text-slate-300 mb-3">Add the bot to your Discord server with the required permissions.</p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <a
                    href={process.env.NEXT_PUBLIC_DISCORD_BOT_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Invite Bot to Server
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </NeonCard>

          {/* Step 4 */}
          <NeonCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Circle className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">4. Start the Bot</h3>
                <p className="text-slate-300 mb-3">Initialize the bot and register slash commands.</p>
                <Button asChild>
                  <Link href="/">Go to Dashboard to Start Bot</Link>
                </Button>
              </div>
            </div>
          </NeonCard>

          {/* Step 5 */}
          <NeonCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Circle className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">5. Setup Your Discord Server</h3>
                <p className="text-slate-300 mb-3">In your Discord server, run the setup command:</p>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-cyan-500/20">
                  <code className="text-cyan-300">/setup</code>
                </div>
              </div>
            </div>
          </NeonCard>

          {/* Step 6 */}
          <NeonCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Circle className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">6. Test the Bot</h3>
                <p className="text-slate-300 mb-3">Try some commands to verify everything works:</p>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-cyan-500/20 space-y-2">
                  <div>
                    <code className="text-cyan-300 text-sm">/ticket open</code>
                    <span className="text-slate-400 text-sm ml-2">- Create a support ticket</span>
                  </div>
                  <div>
                    <code className="text-cyan-300 text-sm">/warn add</code>
                    <span className="text-slate-400 text-sm ml-2">- Warn a user</span>
                  </div>
                  <div>
                    <code className="text-cyan-300 text-sm">/channel lock</code>
                    <span className="text-slate-400 text-sm ml-2">- Lock a channel</span>
                  </div>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-200 text-sm">
            <strong>Security Note:</strong> Keep your bot token and client secret private. Never share them publicly or
            commit them to version control.
          </p>
        </div>
      </div>
    </div>
  )
}
