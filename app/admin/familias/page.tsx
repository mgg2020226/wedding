import { createClient } from "@/lib/supabase/server"
import { FamiliasTable } from "@/components/admin/familias-table"
import { FamiliaForm } from "@/components/admin/familia-form"
import type { Familia } from "@/lib/types"

export default async function FamiliasPage() {
  const supabase = await createClient()

  const { data: familias, error } = await supabase
    .from("familias")
    .select("*")
    .order("apellido")

  if (error) {
    console.error("Error fetching familias:", error)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-cormorant)] text-3xl font-semibold">
          Familias Invitadas
        </h1>
        <FamiliaForm />
      </div>

      <FamiliasTable familias={(familias || []) as Familia[]} />
    </div>
  )
}
