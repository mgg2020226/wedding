import { createClient } from "@/lib/supabase/server"
import { ConfirmacionesTable } from "@/components/admin/confirmaciones-table"
import type { ConfirmacionConIntegrantes } from "@/lib/types"

export default async function ConfirmacionesPage() {
  const supabase = await createClient()

  const { data: confirmaciones, error } = await supabase
    .from("confirmaciones")
    .select(`
      *,
      familias (apellido, cupos),
      regalos (nombre),
      integrantes (id, nombre, es_mayor)
    `)
    .order("confirmado_en", { ascending: false })

  if (error) {
    console.error("Error fetching confirmaciones:", error)
  }

  return (
    <div>
      <h1 className="font-[var(--font-cormorant)] text-3xl font-semibold mb-8">
        Confirmaciones
      </h1>

      <ConfirmacionesTable confirmaciones={(confirmaciones || []) as ConfirmacionConIntegrantes[]} />
    </div>
  )
}
