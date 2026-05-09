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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Search, Eye, Users, MessageSquare, Gift, Download } from "lucide-react"
import type { ConfirmacionConIntegrantes } from "@/lib/types"

function exportToExcel(confirmaciones: ConfirmacionConIntegrantes[]) {
  import("xlsx").then(({ utils, writeFile }) => {
    const rows: Record<string, string | number>[] = []
    let numero = 1

    confirmaciones
      .filter(c => c.asiste && c.integrantes && c.integrantes.length > 0)
      .forEach(c => {
        c.integrantes!.forEach(i => {
          rows.push({
            numero_lista: numero++,
            familia: c.familias?.apellido ?? "",
            integrante: i.nombre,
            mayor_de_edad: i.es_mayor ? "Sí" : "No",
          })
        })
      })

    const ws = utils.json_to_sheet(rows)
    ws["!cols"] = [{ wch: 14 }, { wch: 22 }, { wch: 28 }, { wch: 14 }]
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Invitados")
    writeFile(wb, "invitados_boda.xlsx")
  })
}

interface ConfirmacionesTableProps {
  confirmaciones: ConfirmacionConIntegrantes[]
}

function dialogBody(confirmacion: ConfirmacionConIntegrantes) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Estado</p>
        <Badge variant={confirmacion.asiste ? "default" : "secondary"}>
          {confirmacion.asiste ? "Asistira" : "No asistira"}
        </Badge>
      </div>
      {confirmacion.asiste && confirmacion.integrantes && confirmacion.integrantes.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Integrantes ({confirmacion.integrantes.length})
          </p>
          <ul className="space-y-1">
            {confirmacion.integrantes.map((i) => (
              <li key={i.id} className="flex items-center gap-2">
                <span>{i.nombre}</span>
                <Badge variant="outline" className="text-xs">
                  {i.es_mayor ? "Adulto" : "Menor"}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
      {confirmacion.asiste && confirmacion.opcion_regalo && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Regalo</p>
          <p>
            {confirmacion.opcion_regalo === "lista"
              ? confirmacion.regalos?.nombre || "Regalo de la lista"
              : confirmacion.opcion_regalo === "sobres"
              ? "Lluvia de sobres"
              : "Ninguno"}
          </p>
        </div>
      )}
      {confirmacion.mensaje && (
        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Mensaje
          </p>
          <p className="bg-muted p-3 rounded-lg text-sm">{confirmacion.mensaje}</p>
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground">
          Confirmado el{" "}
          {new Date(confirmacion.confirmado_en).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}

export function ConfirmacionesTable({ confirmaciones }: ConfirmacionesTableProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "attending" | "not-attending">("all")

  const filteredConfirmaciones = confirmaciones.filter(c => {
    const matchesSearch = 
      (c.familias?.apellido || "").toLowerCase().includes(search.toLowerCase()) ||
      c.integrantes?.some(i => i.nombre.toLowerCase().includes(search.toLowerCase()))
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "attending" && c.asiste) ||
      (filter === "not-attending" && !c.asiste)
    
    return matchesSearch && matchesFilter
  })

  const totalAsistentes = confirmaciones.filter(c => c.asiste).length
  const totalNoAsistentes = confirmaciones.filter(c => !c.asiste).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por familia o integrante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
          onClick={() => exportToExcel(confirmaciones)}
        >
          <Download className="w-4 h-4" />
          Descargar Excel
        </Button>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">
              Todos ({confirmaciones.length})
            </TabsTrigger>
            <TabsTrigger value="attending">
              Asisten ({totalAsistentes})
            </TabsTrigger>
            <TabsTrigger value="not-attending">
              No asisten ({totalNoAsistentes})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {filteredConfirmaciones.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">No se encontraron confirmaciones</p>
        ) : (
          filteredConfirmaciones.map((confirmacion) => (
            <div key={confirmacion.id} className="border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{confirmacion.familias?.apellido || "Familia desconocida"}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant={confirmacion.asiste ? "default" : "secondary"}>
                      {confirmacion.asiste ? "Asiste" : "No asiste"}
                    </Badge>
                    {confirmacion.asiste && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {confirmacion.integrantes?.length || 0}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(confirmacion.confirmado_en).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-[var(--font-cormorant)] text-xl">
                        Familia {confirmacion.familias?.apellido}
                      </DialogTitle>
                    </DialogHeader>
                    {dialogBody(confirmacion)}
                  </DialogContent>
                </Dialog>
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
              <TableHead>Familia</TableHead>
              <TableHead className="text-center">Asiste</TableHead>
              <TableHead className="text-center">Invitados</TableHead>
              <TableHead>Opcion Regalo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfirmaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron confirmaciones
                </TableCell>
              </TableRow>
            ) : (
              filteredConfirmaciones.map((confirmacion) => (
                <TableRow key={confirmacion.id}>
                  <TableCell className="font-medium">
                    {confirmacion.familias?.apellido || "Familia desconocida"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={confirmacion.asiste ? "default" : "secondary"}>
                      {confirmacion.asiste ? "Si" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {confirmacion.asiste ? (
                      <span className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4" />
                        {confirmacion.integrantes?.length || 0}
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    {confirmacion.asiste ? (
                      confirmacion.opcion_regalo === "lista" ? (
                        <span className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-primary" />
                          {confirmacion.regalos?.nombre || "Regalo"}
                        </span>
                      ) : confirmacion.opcion_regalo === "sobres" ? "Lluvia de sobres" : "Ninguno"
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(confirmacion.confirmado_en).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-[var(--font-cormorant)] text-xl">
                            Familia {confirmacion.familias?.apellido}
                          </DialogTitle>
                        </DialogHeader>
                        {dialogBody(confirmacion)}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
