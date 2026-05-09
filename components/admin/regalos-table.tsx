"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Trash2, ExternalLink } from "lucide-react"
import type { Regalo } from "@/lib/types"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { RegaloForm } from "./regalo-form"

interface RegalosTableProps {
  regalos: Regalo[]
}

export function RegalosTable({ regalos }: RegalosTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("regalos")
      .delete()
      .eq("id", deleteId)

    if (!error) {
      router.refresh()
    }

    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Regalo</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead className="text-center">Disponibilidad</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regalos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay regalos en la lista
                </TableCell>
              </TableRow>
            ) : (
              regalos.map((regalo) => {
                const disponibles = regalo.cupos_total - regalo.cupos_usados
                const porcentaje = (regalo.cupos_usados / regalo.cupos_total) * 100
                
                return (
                  <TableRow key={regalo.id}>
                    <TableCell className="font-medium">
                      {regalo.nombre}
                      {regalo.enlace_url && (
                        <a 
                          href={regalo.enlace_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {regalo.descripcion || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{regalo.cupos_usados} / {regalo.cupos_total}</span>
                          <span>{disponibles} disponible(s)</span>
                        </div>
                        <Progress value={porcentaje} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={regalo.activo ? "default" : "secondary"}>
                        {regalo.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <RegaloForm regalo={regalo} trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              Editar
                            </DropdownMenuItem>
                          } />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteId(regalo.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar regalo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
