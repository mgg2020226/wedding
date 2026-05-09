"use client"

import { useState } from "react"
import Image from "next/image"
import { RSVPForm } from "@/components/wedding/rsvp-form"
import type { Familia, Regalo, Confirmacion } from "@/lib/types"

type View = "invitacion" | "info" | "detalles" | "confirmacion"

interface Props {
  familia: Familia
  regalos: Regalo[]
  mensajeSobres: string
  confirmacion: Confirmacion | null
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        zIndex: 100,
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        fontSize: "18px",
        color: "#3A2820",
      }}
      aria-label="Volver"
    >
      ←
    </button>
  )
}

export function InvitacionFlow({ familia, regalos, mensajeSobres, confirmacion }: Props) {
  const [view, setView] = useState<View>("invitacion")

  // ── VIEW 1: Envelope landing ───────────────────────────────
  if (view === "invitacion") {
    return (
      <div
        className="relative w-full min-h-screen flex items-center justify-center bg-white cursor-pointer"
        onClick={() => setView("info")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setView("info")}
        aria-label="Abrir invitación"
      >
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <Image
            src="/invitacion.png"
            alt="Invitación de boda Grace & Andrès"
            width={1366}
            height={768}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>
      </div>
    )
  }

  // ── VIEW 2: Info / main invitation spread ──────────────────
  if (view === "info") {
    return (
      <div className="relative w-full bg-white" style={{ maxWidth: "500px", margin: "0 auto" }}>
        {/* Image with transparent button overlays */}
        <div className="relative">
          <Image
            src="/info.png"
            alt="Información de la boda"
            width={500}
            height={1100}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />

          {/* ── Detalles de la boda click area ── */}
          {/* Circle roughly at center-right, ~43-56% from top */}
          <button
            onClick={() => setView("detalles")}
            style={{
              position: "absolute",
              top: "43%",
              left: "50%",
              width: "44%",
              height: "13%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Ver detalles de la boda"
          />

          {/* ── Confirmación click area ── */}
          {/* Envelope roughly at bottom-left, ~57-70% from top */}
          <button
            onClick={() => setView("confirmacion")}
            style={{
              position: "absolute",
              top: "57%",
              left: "4%",
              width: "46%",
              height: "12%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Confirmar asistencia"
          />
        </div>
      </div>
    )
  }

  // ── VIEW 3: Detalles ───────────────────────────────────────
  if (view === "detalles") {
    return (
      <div className="relative w-full bg-white" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <BackButton onClick={() => setView("info")} />
        <Image
          src="/detalles.png"
          alt="Detalles de la boda"
          width={500}
          height={1400}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    )
  }

  // ── VIEW 4: Confirmación / RSVP ────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <BackButton onClick={() => setView("info")} />

      {confirmacion ? (
        <section
          style={{
            padding: "clamp(80px, 12vw, 120px) clamp(16px, 4vw, 48px) clamp(48px, 8vw, 96px)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(107,124,81,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="28" height="28" fill="none" stroke="#6B7C51" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 600,
                fontStyle: "italic",
                color: "#3A2820",
                marginBottom: "12px",
              }}
            >
              Ya has confirmado
            </h2>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1rem",
                color: "#9CAB7C",
                letterSpacing: "0.04em",
              }}
            >
              {confirmacion.asiste
                ? "Gracias por confirmar tu asistencia. Te esperamos el 05 de Julio."
                : "Gracias por responder. Lamentamos que no puedas acompañarnos."}
            </p>
          </div>
        </section>
      ) : (
        <RSVPForm
          familia={familia}
          regalos={regalos}
          mensajeSobres={mensajeSobres}
        />
      )}
    </div>
  )
}
