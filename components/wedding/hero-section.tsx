"use client"

import { useEffect, useState } from "react"

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(targetDate: Date): CountdownTime {
  const difference = targetDate.getTime() - new Date().getTime()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function HeroSection() {
  const weddingDate = new Date("2025-07-12T15:00:00")
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft(weddingDate))
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(weddingDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Nos casamos
          </p>
          <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-4">
            Andres
          </h1>
          <p className="font-[var(--font-cormorant)] text-3xl md:text-4xl text-primary mb-4">&</p>
          <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-12">
            Grace
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-16">
            12 de Julio, 2025
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Nos casamos
        </p>
        <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-4">
          Andres
        </h1>
        <p className="font-[var(--font-cormorant)] text-3xl md:text-4xl text-primary mb-4">&</p>
        <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-12">
          Grace
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-16">
          12 de Julio, 2025
        </p>

        {/* Countdown */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-cormorant)] text-4xl md:text-6xl font-semibold text-foreground">
              {timeLeft.days}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">
              Dias
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-cormorant)] text-4xl md:text-6xl font-semibold text-foreground">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">
              Horas
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-cormorant)] text-4xl md:text-6xl font-semibold text-foreground">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">
              Minutos
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-[var(--font-cormorant)] text-4xl md:text-6xl font-semibold text-foreground">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">
              Segundos
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-muted-foreground"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  )
}
