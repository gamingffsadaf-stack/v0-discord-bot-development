import type { LucideIcon } from "lucide-react"
import { NeonCard } from "./neon-card"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  glowColor?: "cyan" | "magenta" | "purple"
}

export function StatCard({ title, value, icon: Icon, trend, glowColor }: StatCardProps) {
  return (
    <NeonCard title={title} glowColor={glowColor}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-primary neon-glow">{value}</div>
          {trend && (
            <p className="text-sm text-muted-foreground mt-1">
              <span className={trend.value > 0 ? "text-green-400" : "text-red-400"}>
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>{" "}
              {trend.label}
            </p>
          )}
        </div>
        <Icon className="w-12 h-12 text-primary/50" />
      </div>
    </NeonCard>
  )
}
