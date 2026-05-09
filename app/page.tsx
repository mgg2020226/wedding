import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Boda
        </p>
        <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl font-light tracking-tight mb-4">
          Andres & Grace
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          12 de Julio, 2025
        </p>
        <p className="text-muted-foreground mb-8">
          Si tienes una invitacion, ingresa con el enlace que recibiste.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/admin">Panel de Administración</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
