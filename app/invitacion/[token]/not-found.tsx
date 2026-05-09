import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl font-light mb-4">
          404
        </h1>
        <h2 className="font-[var(--font-cormorant)] text-2xl md:text-3xl mb-4">
          Invitacion no encontrada
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Lo sentimos, esta invitacion no existe o ya no esta disponible. 
          Por favor verifica el enlace que recibiste.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  )
}
