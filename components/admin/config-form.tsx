"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"

interface ConfigFormProps {
  config: Record<string, string>
}

export function ConfigForm({ config }: ConfigFormProps) {
  const [fechaLimite, setFechaLimite] = useState(config.fecha_limite_confirmacion || "2025-06-28")
  const [mensajeSobres, setMensajeSobres] = useState(config.mensaje_lluvia_sobres || "")
  const [activo, setActivo] = useState(config.activo === "true")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()

    const updates = [
      { clave: "fecha_limite_confirmacion", valor: fechaLimite },
      { clave: "mensaje_lluvia_sobres", valor: mensajeSobres },
      { clave: "activo", valor: activo.toString() },
    ]

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from("config")
        .upsert(update, { onConflict: "clave" })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    setSaved(true)
    router.refresh()

    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-[var(--font-cormorant)] text-xl">
            Configuracion General
          </CardTitle>
          <CardDescription>
            Ajusta las opciones generales de las invitaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="activo" className="text-base">Invitaciones activas</Label>
              <p className="text-sm text-muted-foreground">
                Cuando este desactivado, los invitados no podran confirmar asistencia
              </p>
            </div>
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={setActivo}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fecha">Fecha limite de confirmacion</Label>
            <Input
              id="fecha"
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Despues de esta fecha se mostrara un mensaje indicando que ya no es posible confirmar
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-[var(--font-cormorant)] text-xl">
            Mensaje de Lluvia de Sobres
          </CardTitle>
          <CardDescription>
            Personaliza el mensaje que se muestra cuando un invitado selecciona la opcion de sobre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={mensajeSobres}
            onChange={(e) => setMensajeSobres(e.target.value)}
            placeholder="Si deseas hacernos un regalo especial, tu sobre sera la mejor forma de comenzar esta nueva etapa juntos."
            rows={3}
          />
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuracion
            </>
          )}
        </Button>
        {saved && (
          <p className="text-sm text-green-600">Configuracion guardada correctamente</p>
        )}
      </div>
    </form>
  )
}
