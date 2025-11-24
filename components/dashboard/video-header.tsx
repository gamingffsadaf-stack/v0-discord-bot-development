"use client"

import { useEffect, useRef } from "react"

export function VideoHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
      })
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(9, 9, 24, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw particle
        ctx.fillStyle = i % 2 === 0 ? "#00ffff" : "#ff00ff"
        ctx.shadowBlur = 10
        ctx.shadowColor = ctx.fillStyle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections
        particles.forEach((p2, j) => {
          if (i === j) return
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 100})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="relative h-64 overflow-hidden rounded-lg">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)" }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl font-bold text-primary neon-glow mb-4">SadafGuard</h1>
        <p className="text-xl text-muted-foreground">Advanced Discord Bot Management</p>
      </div>
    </div>
  )
}
