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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Regalo } from "@/lib/types"

interface RegaloFormProps {
  regalo?: Regalo
  trigger?: ReactNode
}

export function RegaloForm({ regalo, trigger }: RegaloFormProps) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState(regalo?.nombre || "")
  const [descripcion, setDescripcion] = useState(regalo?.descripcion || "")
  const [enlaceUrl, setEnlaceUrl] = useState(regalo?.enlace_url || "")
  const [imagenUrl, setImagenUrl] = useState(regalo?.imagen_url || "")
  const [cuposTotal, setCuposTotal] = useState(regalo?.cupos_total || 1)
  const [activo, setActivo] = useState(regalo?.activo ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isEditing = !!regalo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const data = {
      nombre,
      descripcion: descripcion || null,
      enlace_url: enlaceUrl || null,
      imagen_url: imagenUrl || null,
      cupos_total: cuposTotal,
      activo,
    }

    if (isEditing) {
      const { error: updateError } = await supabase
        .from("regalos")
        .update(data)
        .eq("id", regalo.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from("regalos")
        .insert({ ...data, cupos_usados: 0 })

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
      setNombre("")
      setDescripcion("")
      setEnlaceUrl("")
      setImagenUrl("")
      setCuposTotal(1)
      setActivo(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Regalo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-[var(--font-cormorant)] text-xl">
              {isEditing ? "Editar Regalo" : "Nuevo Regalo"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifica los datos del regalo." 
                : "Agrega un nuevo regalo a la lista."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del regalo</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juego de sabanas"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripcion (opcional)</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Sabanas de algodon egipcio 400 hilos..."
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="enlace">Enlace al producto (opcional)</Label>
              <Input
                id="enlace"
                type="url"
                value={enlaceUrl}
                onChange={(e) => setEnlaceUrl(e.target.value)}
                placeholder="https://tienda.com/producto"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imagen">URL de imagen (opcional)</Label>
              <Input
                id="imagen"
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cupos">Cantidad disponible</Label>
              <Input
                id="cupos"
                type="number"
                min={1}
                max={100}
                value={cuposTotal}
                onChange={(e) => setCuposTotal(parseInt(e.target.value) || 1)}
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
                isEditing ? "Guardar Cambios" : "Crear Regalo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
