"use client"

import { useEffect, useState } from "react"
import { MapPin, Clock, Church, PartyPopper } from "lucide-react"

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(target: Date): CountdownTime {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function EventDetails() {
  const weddingDate = new Date("2025-07-12T15:00:00")
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null)

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(weddingDate))
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(weddingDate)), 1000)
    return () => clearInterval(timer)
  }, [])

  const scrollToRSVP = () => {
    document.getElementById("confirmar")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="event-details" style={{ background: "#FAF7F2" }}>
      {/* ── "MEET US IN" SECTION ── */}
      <div
        style={{
          padding: "clamp(48px, 8vw, 96px) clamp(16px, 4vw, 48px)",
          textAlign: "center",
          borderBottom: "1px solid #EAE0D8",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#9CAB7C",
            fontFamily: "Cormorant Garamond, serif",
            marginBottom: "16px",
          }}
        >
          Meet us in
        </p>
        <p
          style={{
            fontSize: "clamp(2.4rem, 7vw, 5rem)",
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontWeight: 600,
            color: "#5E7248",
            lineHeight: 1.1,
            marginBottom: "32px",
          }}
        >
          Ciudad, País
        </p>
        <p
          style={{
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            letterSpacing: "0.08em",
            color: "#6B5A52",
            fontFamily: "Cormorant Garamond, serif",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          on Saturday, 12 July 2025
        </p>
        <p
          style={{
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            letterSpacing: "0.08em",
            color: "#6B5A52",
            fontFamily: "Cormorant Garamond, serif",
            textTransform: "uppercase",
            marginBottom: "48px",
          }}
        >
          Three in the afternoon.
        </p>

        {/* Countdown */}
        {timeLeft && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(20px, 5vw, 60px)",
              marginBottom: "48px",
            }}
          >
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours.toString().padStart(2, "0"), label: "Hours" },
              { value: timeLeft.minutes.toString().padStart(2, "0"), label: "Minutes" },
              { value: timeLeft.seconds.toString().padStart(2, "0"), label: "Seconds" },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontFamily: "Cormorant Garamond, serif",
                    fontWeight: 400,
                    color: "#5E7248",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "#9CAB7C",
                    fontFamily: "Cormorant Garamond, serif",
                    marginTop: "8px",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* RSVP Button */}
        <button
          onClick={scrollToRSVP}
          style={{
            background: "#6B7C51",
            color: "white",
            border: "none",
            borderRadius: "999px",
            padding: "clamp(14px, 2.5vw, 18px) clamp(32px, 6vw, 56px)",
            fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "Cormorant Garamond, serif",
            cursor: "pointer",
            transition: "background 0.2s ease, transform 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#5A6844")}
          onMouseLeave={e => (e.currentTarget.style.background = "#6B7C51")}
        >
          Kindly Confirm Attendance
        </button>
      </div>

      {/* ── EVENT CARDS ── */}
      <div style={{ padding: "clamp(40px, 7vw, 80px) clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#9CAB7C",
              fontFamily: "Cormorant Garamond, serif",
              marginBottom: "40px",
            }}
          >
            The Celebration
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(16px, 3vw, 32px)",
              marginBottom: "clamp(24px, 4vw, 40px)",
            }}
          >
            {/* Ceremony card */}
            <div
              style={{
                background: "white",
                border: "1px solid #EAE0D8",
                borderRadius: "4px",
                padding: "clamp(24px, 4vw, 40px)",
                boxShadow: "0 2px 16px rgba(107,90,82,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(107,124,81,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Church size={18} color="#6B7C51" />
                </div>
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                    fontWeight: 600,
                    color: "#3A2820",
                    margin: 0,
                  }}
                >
                  Ceremonia
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Clock size={16} color="#9CAB7C" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: 600, color: "#3A2820", margin: 0 }}>
                      3:00 PM
                    </p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: "#9CAB7C", margin: 0 }}>
                      Sábado, 12 de Julio 2025
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <MapPin size={16} color="#9CAB7C" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: 600, color: "#3A2820", margin: 0 }}>
                      Iglesia San Francisco
                    </p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: "#9CAB7C", margin: 0 }}>
                      Calle Principal 123, Ciudad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reception card */}
            <div
              style={{
                background: "white",
                border: "1px solid #EAE0D8",
                borderRadius: "4px",
                padding: "clamp(24px, 4vw, 40px)",
                boxShadow: "0 2px 16px rgba(107,90,82,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(107,124,81,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PartyPopper size={18} color="#6B7C51" />
                </div>
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                    fontWeight: 600,
                    color: "#3A2820",
                    margin: 0,
                  }}
                >
                  Recepción
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Clock size={16} color="#9CAB7C" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: 600, color: "#3A2820", margin: 0 }}>
                      5:00 PM
                    </p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: "#9CAB7C", margin: 0 }}>
                      Después de la ceremonia
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <MapPin size={16} color="#9CAB7C" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: 600, color: "#3A2820", margin: 0 }}>
                      Jardín de Eventos
                    </p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.85rem", color: "#9CAB7C", margin: 0 }}>
                      Avenida Central 456, Ciudad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dress code */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(20px, 3.5vw, 32px)",
              background: "white",
              border: "1px solid #EAE0D8",
              borderRadius: "4px",
              boxShadow: "0 2px 16px rgba(107,90,82,0.06)",
            }}
          >
            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#9CAB7C",
                fontFamily: "Cormorant Garamond, serif",
                marginBottom: "8px",
              }}
            >
              Dress Code
            </p>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                fontWeight: 600,
                color: "#3A2820",
                marginBottom: "6px",
              }}
            >
              Formal / Elegante
            </p>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "0.85rem",
                color: "#9CAB7C",
              }}
            >
              Por favor evitar blanco, beige o marfil
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
