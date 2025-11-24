import { VideoHeader } from "@/components/dashboard/video-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Ticket, UserCog, Lock, MessageSquare, BarChart3, Bot } from "lucide-react"

export default function HomePage() {
  const botInviteUrl = process.env.NEXT_PUBLIC_DISCORD_BOT_INVITE_URL

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <VideoHeader />

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to SadafGuard Dashboard</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Powerful Discord bot management with advanced moderation, ticket system, auto-replies, and security
            features. Built for Bengali communities.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link href="/bot">
              <Button size="lg" className="neon-border">
                <Bot className="w-5 h-5 mr-2" />
                Start Bot
              </Button>
            </Link>
            {botInviteUrl && (
              <a href={botInviteUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="glass-card border-primary/20 bg-transparent">
                  <Bot className="w-5 h-5 mr-2" />
                  Invite Bot
                </Button>
              </a>
            )}
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="glass-card border-primary/20 bg-transparent">
                Open Dashboard
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="glass-card border-primary/20 bg-transparent">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            icon={Ticket}
            title="Ticket System"
            description="Advanced support ticket management with categories and logging"
          />
          <FeatureCard
            icon={UserCog}
            title="Moderation Tools"
            description="Comprehensive moderation with warnings, kicks, bans, and timeouts"
          />
          <FeatureCard
            icon={Lock}
            title="Channel Management"
            description="Lock/unlock channels, set slowmode, and manage permissions"
          />
          <FeatureCard
            icon={Shield}
            title="Security Features"
            description="Profanity filter, DM protection, and anti-spam measures"
          />
          <FeatureCard
            icon={MessageSquare}
            title="Auto-Replies"
            description="Create custom auto-replies with trigger words"
          />
          <FeatureCard
            icon={BarChart3}
            title="Analytics & Logs"
            description="Detailed moderation logs and server statistics"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Shield
  title: string
  description: string
}) {
  return (
    <div className="glass-card border border-primary/20 p-6 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
