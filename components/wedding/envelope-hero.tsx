"use client"

import { useState } from "react"
import Image from "next/image"

function scallopsPath(
  x1: number, y1: number,
  x2: number, y2: number,
  n: number,
  depth: number
): string {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  const px = uy, py = -ux

  let d = `M ${x1.toFixed(1)} ${y1.toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const step = len / n
    const ex = x1 + ux * (i + 1) * step
    const ey = y1 + uy * (i + 1) * step
    const cx = x1 + ux * (i + 0.5) * step + px * depth
    const cy = y1 + uy * (i + 0.5) * step + py * depth
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
  }
  return d
}

// ── Wax Seal ──────────────────────────────────────────────
function WaxSeal({ small = false }: { small?: boolean }) {
  const s = small ? 52 : 76
  return (
    <svg
      width={s}
      height={s * 1.2}
      viewBox="0 0 76 92"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))", display: "block" }}
    >
      <ellipse cx="38" cy="52" rx="34" ry="38" fill="#F4ECD8" />
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2 - Math.PI / 2
        const x = (38 + 32 * Math.cos(a)).toFixed(2)
        const y = (52 + 36 * Math.sin(a)).toFixed(2)
        return <circle key={i} cx={x} cy={y} r="1.4" fill="#D8C8A8" />
      })}
      <circle cx="38" cy="20" r="7" fill="#E8C4BE" />
      <circle cx="38" cy="20" r="4.5" fill="#D4A8A0" />
      <circle cx="38" cy="20" r="2" fill="#C49088" />
      <line x1="38" y1="27" x2="38" y2="36" stroke="#8A9870" strokeWidth="1.5" />
      <path d="M 38 32 Q 31 28 31 34 Q 36 35 38 32" fill="#A0B078" />
      <path d="M 38 32 Q 45 28 45 34 Q 40 35 38 32" fill="#A0B078" />
      <text x="38" y="64" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="14" fontStyle="italic" fill="#6B7C51" letterSpacing="2">
        A &amp; G
      </text>
    </svg>
  )
}

// ── Oval Photo Frame ───────────────────────────────────────
function OvalPhotoFrame({ src }: { src: string }) {
  const W = 110, H = 138
  return (
    <div style={{ position: "relative", width: W, height: H, flexShrink: 0 }}>
      {/* Sage green oval backing */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Outer beaded ring */}
        <ellipse cx={W / 2} cy={H / 2} rx={W / 2 - 1} ry={H / 2 - 1} fill="#8A9B6A" />
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2 - Math.PI / 2
          const x = (W / 2 + (W / 2 - 4) * Math.cos(a)).toFixed(2)
          const y = (H / 2 + (H / 2 - 4) * Math.sin(a)).toFixed(2)
          return <circle key={i} cx={x} cy={y} r="2" fill="#A8BC88" />
        })}
        {/* Inner ring */}
        <ellipse cx={W / 2} cy={H / 2} rx={W / 2 - 10} ry={H / 2 - 10}
          fill="none" stroke="#F5EDE5" strokeWidth="1.5" />
      </svg>
      {/* Couple photo clipped to oval */}
      <div style={{
        position: "absolute",
        left: "11px", top: "11px",
        width: W - 22, height: H - 22,
        borderRadius: "50%",
        overflow: "hidden",
      }}>
        <Image
          src={src}
          alt="Couple"
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="88px"
        />
      </div>
    </div>
  )
}

// ── Flower Crop (CSS sprite from flowers-sheet.png) ────────
// x, y, w, h = fractions 0-1 of the full sheet
function FlowerCrop({
  x, y, w, h,
  renderW, renderH,
  flip = false,
  style,
}: {
  x: number; y: number; w: number; h: number
  renderW: number | string; renderH: number | string
  flip?: boolean
  style?: React.CSSProperties
}) {
  const bsX = (100 / w).toFixed(2)
  const bsY = (100 / h).toFixed(2)
  const bpX = w >= 1 ? "0%" : `${(x / (1 - w) * 100).toFixed(2)}%`
  const bpY = h >= 1 ? "0%" : `${(y / (1 - h) * 100).toFixed(2)}%`

  return (
    <div style={{
      width: renderW,
      height: renderH,
      backgroundImage: "url(/flowers-sheet.png)",
      backgroundSize: `${bsX}% ${bsY}%`,
      backgroundPosition: `${bpX} ${bpY}`,
      backgroundRepeat: "no-repeat",
      mixBlendMode: "multiply" as const,
      transform: flip ? "scaleX(-1)" : undefined,
      ...style,
    }} />
  )
}

// ── Main Component ─────────────────────────────────────────
export function EnvelopeHero() {
  const [isOpen, setIsOpen] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [bgError, setBgError] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => setCardVisible(true), 650)
  }

  const scrollToDetails = () => {
    document.getElementById("event-details")?.scrollIntoView({ behavior: "smooth" })
  }

  const leftLace = scallopsPath(0, 0, 250, 187, 22, 9)
  const rightLace = scallopsPath(500, 0, 250, 187, 22, -9)

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* ── BACKGROUND IMAGE (painting) ── */}
      {!bgError ? (
        <div className="absolute inset-0">
          <Image
            src="/wedding-bg.jpg"
            alt=""
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
            onError={() => setBgError(true)}
          />
          {/* Soft overlay so envelope stands out */}
          <div className="absolute inset-0" style={{ background: "rgba(250,245,238,0.35)" }} />
        </div>
      ) : (
        // Fallback gradient when image not found
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 15% 85%, rgba(115,148,72,0.28) 0%, transparent 58%),
            radial-gradient(ellipse 50% 45% at 85% 15%, rgba(188,168,104,0.22) 0%, transparent 55%),
            linear-gradient(158deg, #EAE5D5 0%, #D8D0B8 20%, #C2CC98 45%, #C8D2A4 60%, #D5CDB5 80%, #E8E2D0 100%)
          `
        }} />
      )}

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }} />

      <div className="relative flex flex-col items-center gap-6" style={{ perspective: "1400px" }}>

        {/* ── FLORAL DECORATIONS (show when open) ── */}
        {cardVisible && (
          <>
            {/* Calla lilies — left of envelope */}
            <FlowerCrop
              x={0.01} y={0.25} w={0.37} h={0.44}
              renderW="clamp(90px, 18vw, 150px)"
              renderH="clamp(120px, 24vw, 200px)"
              style={{
                position: "absolute",
                left: "calc(50% - min(250px,46vw) - clamp(80px,16vw,140px))",
                top: "clamp(-30px,-6vw,-50px)",
                pointerEvents: "none",
                opacity: 1,
                transition: "opacity 0.6s ease 0.4s",
                zIndex: 25,
              }}
            />
            {/* Pink roses — right of envelope top */}
            <FlowerCrop
              x={0.63} y={0.26} w={0.35} h={0.27}
              renderW="clamp(70px, 14vw, 120px)"
              renderH="clamp(55px, 11vw, 95px)"
              style={{
                position: "absolute",
                right: "calc(50% - min(250px,46vw) - clamp(65px,13vw,115px))",
                top: "clamp(-10px,-2vw,-20px)",
                pointerEvents: "none",
                opacity: 1,
                transition: "opacity 0.6s ease 0.5s",
                zIndex: 25,
              }}
            />
            {/* Red roses — right of envelope bottom */}
            <FlowerCrop
              x={0.60} y={0.55} w={0.40} h={0.34}
              renderW="clamp(75px, 15vw, 130px)"
              renderH="clamp(65px, 13vw, 110px)"
              style={{
                position: "absolute",
                right: "calc(50% - min(250px,46vw) - clamp(70px,14vw,125px))",
                bottom: "clamp(10px,2vw,20px)",
                pointerEvents: "none",
                opacity: 1,
                transition: "opacity 0.6s ease 0.55s",
                zIndex: 25,
              }}
            />
            {/* White magnolia — below envelope left */}
            <FlowerCrop
              x={0.01} y={0.73} w={0.34} h={0.27}
              renderW="clamp(65px, 13vw, 110px)"
              renderH="clamp(50px, 10vw, 85px)"
              style={{
                position: "absolute",
                left: "calc(50% - min(250px,46vw) - clamp(60px,12vw,105px))",
                bottom: "clamp(-5px,-1vw,-10px)",
                pointerEvents: "none",
                opacity: 1,
                transition: "opacity 0.6s ease 0.6s",
                zIndex: 25,
              }}
            />
          </>
        )}

        {/* ── ENVELOPE ASSEMBLY ── */}
        <div className="relative" style={{
          width: "min(500px, 92vw)",
          height: "min(340px, 62.4vw)",
          overflow: "visible",
        }}>

          {/* Envelope body */}
          <div className="absolute inset-0 rounded-sm shadow-2xl" style={{ background: "#E4B8B0" }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 340" preserveAspectRatio="none">
              <polygon points="0,340 250,205 0,148" fill="#CC9E94" opacity="0.65" />
              <polygon points="500,340 250,205 500,148" fill="#C89088" opacity="0.65" />
              <polygon points="0,340 250,205 500,340" fill="#D8AA9E" opacity="0.45" />
            </svg>
          </div>

          {/* ── INVITATION CARD ── */}
          <div style={{
            position: "absolute",
            width: "54%",
            left: "23%",
            top: cardVisible ? "-60%" : "115%",
            aspectRatio: "0.68",
            zIndex: 5,
            transition: "top 1s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",
            opacity: cardVisible ? 1 : 0,
            background: "white",
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            borderRadius: "2px",
            overflow: "hidden",
          }}>
            {/* Pink stripe header */}
            <div style={{
              height: "12px",
              background: "repeating-linear-gradient(90deg, #E4B8B0 0px, #E4B8B0 14px, white 14px, white 22px)",
            }} />
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(8px, 2vw, 14px) clamp(8px, 2vw, 14px)",
              height: "calc(100% - 12px)",
              textAlign: "center",
              gap: "clamp(3px, 0.8vw, 6px)",
            }}>
              <p style={{
                fontSize: "clamp(0.45rem, 1.1vw, 0.6rem)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#9CAB7C",
                fontFamily: "Cormorant Garamond, serif",
              }}>
                Save The Date
              </p>

              {/* Oval photo frame */}
              <div style={{ margin: "clamp(2px, 0.5vw, 4px) 0" }}>
                <OvalPhotoFrame src="/couple.jpg" />
              </div>

              <p style={{
                fontSize: "clamp(0.9rem, 2.4vw, 1.4rem)",
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontWeight: 600,
                color: "#5E7248",
                lineHeight: 1.15,
              }}>
                Andres &amp; Grace
              </p>
              {/* Date pill */}
              <div style={{
                marginTop: "clamp(2px, 0.5vw, 4px)",
                background: "#E4B8B0",
                borderRadius: "999px",
                padding: "clamp(3px, 0.8vw, 5px) clamp(10px, 2.5vw, 16px)",
              }}>
                <p style={{
                  color: "white",
                  fontSize: "clamp(0.65rem, 1.6vw, 0.9rem)",
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}>
                  12.07.2025
                </p>
              </div>
            </div>
          </div>

          {/* ── ENVELOPE FLAP ── */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "55%",
            transformOrigin: "top center",
            transform: isOpen ? "rotateX(-180deg)" : "rotateX(0deg)",
            transition: "transform 0.85s cubic-bezier(0.4,0,0.2,1)",
            zIndex: isOpen ? 2 : 10,
            transformStyle: "preserve-3d",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "#DDB0A6",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backfaceVisibility: "hidden",
            }} />
            <svg style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              overflow: "visible",
              backfaceVisibility: "hidden",
            }} viewBox="0 0 500 187" preserveAspectRatio="none">
              <path d={leftLace} fill="none" stroke="#F0E0D4" strokeWidth="18" strokeLinecap="round" opacity="0.75" />
              <path d={leftLace} fill="none" stroke="#E8CEC4" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
              <path d={leftLace} fill="none" stroke="#D8B8AC" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="0.01 14.2" opacity="0.7" />
              <path d={rightLace} fill="none" stroke="#F0E0D4" strokeWidth="18" strokeLinecap="round" opacity="0.75" />
              <path d={rightLace} fill="none" stroke="#E8CEC4" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
              <path d={rightLace} fill="none" stroke="#D8B8AC" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="0.01 14.2" opacity="0.7" />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              background: "#CC9E94",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }} />
          </div>

          {/* ── WAX SEAL ── */}
          <div style={{
            position: "absolute",
            left: "50%", top: isOpen ? "63%" : "44%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            width: isOpen ? "50px" : "72px",
            transition: "top 0.8s ease, width 0.4s ease",
          }}>
            <WaxSeal small={isOpen} />
          </div>

          {/* ── CLOSED STATE TEXT ── */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "space-between",
            paddingTop: "clamp(10px,3vw,18px)",
            paddingBottom: "clamp(10px,3vw,18px)",
            zIndex: 8, pointerEvents: "none",
            opacity: isOpen ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontSize: "clamp(0.5rem,1.2vw,0.6rem)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#6B4E42",
                fontFamily: "Cormorant Garamond, serif",
                marginBottom: "4px",
              }}>
                A Love Letter from
              </p>
              <p style={{
                fontSize: "clamp(1.6rem,4.5vw,2.6rem)",
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic", fontWeight: 600,
                color: "#3A2820",
                lineHeight: 1.1,
              }}>
                Andres &amp; Grace
              </p>
            </div>
            <button
              onClick={handleOpen}
              style={{
                pointerEvents: "all",
                fontSize: "clamp(0.5rem,1.2vw,0.62rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#6B4E42",
                fontFamily: "Cormorant Garamond, serif",
                background: "none", border: "none", cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                textDecorationColor: "rgba(107,78,66,0.4)",
              }}
            >
              Open the invitation
            </button>
          </div>
        </div>

        {/* ── SCROLL INDICATOR ── */}
        {cardVisible && (
          <button
            onClick={scrollToDetails}
            className="flex flex-col items-center gap-1 animate-bounce"
            style={{ color: "#6B4E42", background: "none", border: "none", cursor: "pointer", position: "relative", zIndex: 30 }}
          >
            <p style={{
              fontSize: "0.55rem", letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontFamily: "Cormorant Garamond, serif",
              color: "#6B4E42",
            }}>Continue</p>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}
