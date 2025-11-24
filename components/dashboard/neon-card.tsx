import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NeonCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  glowColor?: "cyan" | "magenta" | "purple"
}

export function NeonCard({ title, description, children, className, glowColor = "cyan" }: NeonCardProps) {
  const glowClass = {
    cyan: "hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
    magenta: "hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]",
    purple: "hover:shadow-[0_0_20px_rgba(138,43,226,0.3)]",
  }[glowColor]

  return (
    <Card className={cn("glass-card border-primary/20 transition-all duration-300", glowClass, className)}>
      <CardHeader>
        <CardTitle className="text-primary neon-glow">{title}</CardTitle>
        {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
