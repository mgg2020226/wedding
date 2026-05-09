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
import { Input } from "@/components/ui/input"
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
import { MoreHorizontal, Copy, Trash2, Search, ExternalLink } from "lucide-react"
import type { Familia } from "@/lib/types"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { FamiliaForm } from "./familia-form"

interface FamiliasTableProps {
  familias: Familia[]
}

export function FamiliasTable({ familias }: FamiliasTableProps) {
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const filteredFamilias = familias.filter(f => 
    f.apellido.toLowerCase().includes(search.toLowerCase()) ||
    f.token.toLowerCase().includes(search.toLowerCase())
  )

  const copyInvitationLink = (token: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    navigator.clipboard.writeText(`${baseUrl}/invitacion/${token}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("familias")
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
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por apellido o token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {filteredFamilias.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">No se encontraron familias</p>
        ) : (
          filteredFamilias.map((familia) => (
            <div key={familia.id} className="border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{familia.apellido}</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded mt-1 inline-block max-w-full truncate">
                    {familia.token}
                  </code>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">{familia.cupos} cupos</span>
                    <Badge variant={familia.activo ? "default" : "secondary"}>
                      {familia.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copyInvitationLink(familia.token)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar enlace
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`/invitacion/${familia.token}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver invitacion
                      </a>
                    </DropdownMenuItem>
                    <FamiliaForm familia={familia} trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Editar
                      </DropdownMenuItem>
                    } />
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(familia.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Apellido</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-center">Cupos</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFamilias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No se encontraron familias
                </TableCell>
              </TableRow>
            ) : (
              filteredFamilias.map((familia) => (
                <TableRow key={familia.id}>
                  <TableCell className="font-medium">{familia.apellido}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {familia.token}
                    </code>
                  </TableCell>
                  <TableCell className="text-center">{familia.cupos}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={familia.activo ? "default" : "secondary"}>
                      {familia.activo ? "Activo" : "Inactivo"}
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
                        <DropdownMenuItem onClick={() => copyInvitationLink(familia.token)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar enlace
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`/invitacion/${familia.token}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver invitacion
                          </a>
                        </DropdownMenuItem>
                        <FamiliaForm familia={familia} trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Editar
                          </DropdownMenuItem>
                        } />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(familia.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar familia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminaran tambien las confirmaciones asociadas.
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
