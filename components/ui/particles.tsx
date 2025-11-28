"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ParticlesProps {
    className?: string
    quantity?: number
    color?: string
    speed?: number
}

export function Particles({ className, quantity = 50, color = "#ffffff", speed = 1 }: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<
        Array<{
            x: number
            y: number
            radius: number
            dx: number
            dy: number
            opacity: number
        }>
    >([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const initParticles = () => {
            particlesRef.current = []
            for (let i = 0; i < quantity; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    dx: (Math.random() - 0.5) * speed,
                    dy: (Math.random() - 0.5) * speed,
                    opacity: Math.random() * 0.5 + 0.1,
                })
            }
        }

        const animate = () => {
            requestAnimationFrame(animate)
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current.forEach((particle) => {
                // Update position
                particle.x += particle.dx
                particle.y += particle.dy

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.dx = -particle.dx
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.dy = -particle.dy
                }

                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
                ctx.fillStyle = color
                    .replace(")", `, ${particle.opacity})`)
                    .replace("rgb", "rgba")
                    .replace("#", "rgba(")
                    .replace(/^rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i, (_, r, g, b) => {
                        return `rgba(${Number.parseInt(r, 16)}, ${Number.parseInt(g, 16)}, ${Number.parseInt(b, 16)}`
                    })
                ctx.fill()
            })
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        animate()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [quantity, color, speed])

    return <canvas ref={canvasRef} className={cn("pointer-events-none", className)} aria-hidden="true" />
}
