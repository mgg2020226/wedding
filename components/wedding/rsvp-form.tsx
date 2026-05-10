"use client"

import { useState } from "react"
import type { Familia, Regalo } from "@/lib/types"

interface RSVPFormProps {
  familia: Familia
  regalos: Regalo[]
  mensajeSobres: string
}

interface Integrante {
  nombre: string
  es_mayor: boolean
}

const PINK = "#E4B8B0"
const SAGE = "#6B7C51"
const DARK = "#3A2820"
const CREAM = "#FAF7F2"
const MUTED = "#9CAB7C"
const DEEP = "#8B2442"
const FONT = "Cormorant Garamond, Georgia, serif"

export function RSVPForm({ familia, regalos: _regalos, mensajeSobres: _mensajeSobres }: RSVPFormProps) {
  const [asiste, setAsiste] = useState<boolean | null>(null)
  const [integrantes, setIntegrantes] = useState<Integrante[]>([{ nombre: "", es_mayor: true }])
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addIntegrante = () => {
    if (integrantes.length < familia.cupos) {
      setIntegrantes([...integrantes, { nombre: "", es_mayor: true }])
    }
  }

  const removeIntegrante = (index: number) => {
    if (integrantes.length > 1) {
      setIntegrantes(integrantes.filter((_, i) => i !== index))
    }
  }

  const updateIntegrante = (index: number, field: keyof Integrante, value: string | boolean) => {
    const updated = [...integrantes]
    updated[index] = { ...updated[index], [field]: value }
    setIntegrantes(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/confirmacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familia_id: familia.id,
          asiste,
          integrantes: asiste ? integrantes.filter(i => i.nombre.trim()) : [],
          opcion_regalo: null,
          regalo_id: null,
          mensaje: mensaje.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al enviar confirmación")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(107,124,81,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
          }}>
            <svg width="32" height="32" fill="none" stroke={SAGE} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: MUTED, marginBottom: "12px" }}>
            Confirmación enviada
          </p>
          <h2 style={{ fontFamily: FONT, fontSize: "2.2rem", fontStyle: "italic", fontWeight: 600, color: DARK, lineHeight: 1.2, marginBottom: "16px" }}>
            {asiste ? "¡Nos vemos el 05 de Julio!" : "Gracias por responder"}
          </h2>
          <p style={{ fontFamily: FONT, fontSize: "1.05rem", color: "#8A9070", lineHeight: 1.7 }}>
            {asiste
              ? "Tu asistencia ha sido registrada. Te esperamos con mucha alegría."
              : "Lamentamos que no puedas acompañarnos. Te tendremos presente."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rsvp-form-bold" style={{ minHeight: "100vh", background: CREAM, padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 40px) clamp(40px, 8vw, 60px)" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .rsvp-form-bold p, .rsvp-form-bold span, .rsvp-form-bold h1, .rsvp-form-bold h2, .rsvp-form-bold label { font-weight: 700 !important; color: #000 !important; }
      `}</style>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* ── Header: familia + cupos ── */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase", color: MUTED, marginBottom: "10px" }}>
            Confirmación de asistencia
          </p>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(2rem, 6vw, 2.8rem)", fontStyle: "italic", fontWeight: 600, color: DARK, lineHeight: 1.15, marginBottom: "14px" }}>
            Familia {familia.apellido}
          </h1>
          {/* Cupos badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(139,36,66,0.08)",
            border: "1.5px solid rgba(139,36,66,0.5)",
            borderRadius: "999px",
            padding: "6px 18px",
          }}>
            <svg width="14" height="14" fill="none" stroke={DEEP} viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ fontFamily: FONT, fontSize: "0.85rem", color: DARK, letterSpacing: "0.04em" }}>
              {familia.cupos} {familia.cupos === 1 ? "cupo disponible" : "cupos disponibles"}
            </span>
          </div>
        </div>

        <div style={{ width: "40px", height: "1px", background: "rgba(228,184,176,0.6)", margin: "0 auto 36px" }} />

        <form onSubmit={handleSubmit}>

          {/* ── ¿Asistirás? ── */}
          <div style={{ marginBottom: "36px" }}>
            <p style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", color: MUTED, textAlign: "center", marginBottom: "18px" }}>
              ¿Podrás asistir?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { value: true, label: "Sí, asistiré", icon: "♡" },
                { value: false, label: "No podré ir", icon: "✕" },
              ].map(({ value, label, icon }) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => setAsiste(value)}
                  style={{
                    padding: "20px 12px",
                    borderRadius: "6px",
                    border: asiste === value ? `1.5px solid ${PINK}` : "1.5px solid rgba(0,0,0,0.08)",
                    background: asiste === value ? "rgba(228,184,176,0.12)" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: FONT,
                  }}
                >
                  <div style={{ fontSize: "1.6rem", marginBottom: "8px", color: asiste === value ? PINK : "#C0B4AE" }}>
                    {icon}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: asiste === value ? DARK : "#9E9088", fontFamily: FONT, letterSpacing: "0.02em" }}>
                    {label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Integrantes ── */}
          {asiste && (
            <div style={{ marginBottom: "36px" }}>
              <p style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", color: MUTED, textAlign: "center", marginBottom: "6px" }}>
                ¿Quiénes asistirán?
              </p>
              <p style={{ fontFamily: FONT, fontSize: "0.82rem", color: "#B0A49C", textAlign: "center", marginBottom: "20px" }}>
                Hasta {familia.cupos} {familia.cupos === 1 ? "persona" : "personas"}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {integrantes.map((integrante, index) => (
                  <div key={index} style={{
                    background: "white",
                    borderRadius: "6px",
                    border: "1px solid rgba(0,0,0,0.07)",
                    padding: "16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      {/* Number */}
                      <div style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        background: "rgba(228,184,176,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: "10px",
                      }}>
                        <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: DARK }}>{index + 1}</span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={integrante.nombre}
                          onChange={(e) => updateIntegrante(index, "nombre", e.target.value)}
                          placeholder={index === 0 ? "Nombre completo (principal)" : "Nombre completo"}
                          required={index === 0}
                          style={{
                            width: "100%",
                            border: "none",
                            borderBottom: "1px solid rgba(0,0,0,0.1)",
                            background: "transparent",
                            fontFamily: FONT,
                            fontSize: "1rem",
                            color: DARK,
                            padding: "6px 0",
                            outline: "none",
                            marginBottom: "12px",
                          }}
                        />

                        {/* Mayor de edad toggle */}
                        <button
                          type="button"
                          onClick={() => updateIntegrante(index, "es_mayor", !integrante.es_mayor)}
                          style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            background: "none", border: "none", cursor: "pointer", padding: 0,
                          }}
                        >
                          <div style={{
                            width: "18px", height: "18px", borderRadius: "4px",
                            border: `1.5px solid ${integrante.es_mayor ? SAGE : "rgba(0,0,0,0.2)"}`,
                            background: integrante.es_mayor ? SAGE : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s", flexShrink: 0,
                          }}>
                            {integrante.es_mayor && (
                              <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span style={{ fontFamily: FONT, fontSize: "0.82rem", color: "#8A8078", letterSpacing: "0.02em" }}>
                            Mayor de edad
                          </span>
                        </button>
                      </div>

                      {/* Remove */}
                      {integrantes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIntegrante(index)}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "#C0B4AE", padding: "4px", marginTop: "6px", flexShrink: 0,
                          }}
                          aria-label="Eliminar"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {integrantes.length < familia.cupos && (
                <button
                  type="button"
                  onClick={addIntegrante}
                  style={{
                    width: "100%", marginTop: "12px",
                    padding: "12px",
                    background: "transparent",
                    border: "1.5px dashed rgba(228,184,176,0.6)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontFamily: FONT,
                    fontSize: "0.85rem",
                    color: PINK,
                    letterSpacing: "0.05em",
                    transition: "border-color 0.2s",
                  }}
                >
                  + Agregar persona
                </button>
              )}
            </div>
          )}

          {/* ── Mensaje opcional ── */}
          <div style={{ marginBottom: "36px" }}>
            <p style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", color: MUTED, marginBottom: "12px", textAlign: "center" }}>
              Mensaje para los novios (opcional)
            </p>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe algo especial…"
              rows={3}
              style={{
                width: "100%",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "6px",
                background: "white",
                fontFamily: FONT,
                fontSize: "1rem",
                color: DARK,
                padding: "14px 16px",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: FONT, fontSize: "0.9rem", color: "#C0705A", textAlign: "center", marginBottom: "16px" }}>
              {error}
            </p>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading || asiste === null || (asiste === true && !integrantes[0].nombre.trim())}
            style={{
              width: "100%",
              padding: "16px",
              background: asiste === null ? "rgba(139,36,66,0.25)" : DEEP,
              color: asiste === null ? "rgba(139,36,66,0.45)" : "white",
              border: "none",
              borderRadius: "6px",
              fontFamily: FONT,
              fontSize: "1rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: loading || asiste === null ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Enviando…
              </>
            ) : "Confirmar"}
          </button>

        </form>
      </div>
    </div>
  )
}
