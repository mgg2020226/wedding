import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="font-[var(--font-cormorant)] text-2xl">
            Error de Autenticacion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Hubo un problema al iniciar sesion. Por favor intenta de nuevo.
          </p>
          <Button asChild>
            <Link href="/auth/login">Volver a intentar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
