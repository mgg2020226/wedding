"use client"

import { useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Familia } from "@/lib/types"

interface FamiliaFormProps {
  familia?: Familia
  trigger?: ReactNode
}

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function FamiliaForm({ familia, trigger }: FamiliaFormProps) {
  const [open, setOpen] = useState(false)
  const [apellido, setApellido] = useState(familia?.apellido || "")
  const [token, setToken] = useState(familia?.token || generateToken())
  const [cupos, setCupos] = useState(familia?.cupos || 2)
  const [activo, setActivo] = useState(familia?.activo ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isEditing = !!familia

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    if (isEditing) {
      const { error: updateError } = await supabase
        .from("familias")
        .update({ apellido, token, cupos, activo })
        .eq("id", familia.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from("familias")
        .insert({ apellido, token, cupos, activo })

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    setOpen(false)
    router.refresh()
    
    if (!isEditing) {
      setApellido("")
      setToken(generateToken())
      setCupos(2)
      setActivo(true)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && !isEditing) {
      setToken(generateToken())
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Familia
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-[var(--font-cormorant)] text-xl">
              {isEditing ? "Editar Familia" : "Nueva Familia"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifica los datos de la familia invitada." 
                : "Agrega una nueva familia a la lista de invitados."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Familia Rodriguez"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="token">Token de invitacion</Label>
              <div className="flex gap-2">
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="abc12345"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setToken(generateToken())}
                >
                  Generar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Este token sera parte del enlace de invitacion
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cupos">Numero de invitados</Label>
              <Input
                id="cupos"
                type="number"
                min={1}
                max={20}
                value={cupos}
                onChange={(e) => setCupos(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="activo">Activo</Label>
              <Switch
                id="activo"
                checked={activo}
                onCheckedChange={setActivo}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Guardando..." : "Creando..."}
                </>
              ) : (
                isEditing ? "Guardar Cambios" : "Crear Familia"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
