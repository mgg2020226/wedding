import { createClient } from "@/lib/supabase/server"
import { RegalosTable } from "@/components/admin/regalos-table"
import { RegaloForm } from "@/components/admin/regalo-form"
import type { Regalo } from "@/lib/types"

export default async function RegalosPage() {
  const supabase = await createClient()

  const { data: regalos, error } = await supabase
    .from("regalos")
    .select("*")
    .order("nombre")

  if (error) {
    console.error("Error fetching regalos:", error)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-cormorant)] text-3xl font-semibold">
          Lista de Regalos
        </h1>
        <RegaloForm />
      </div>

      <RegalosTable regalos={(regalos || []) as Regalo[]} />
    </div>
  )
}
