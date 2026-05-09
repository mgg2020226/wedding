import { createClient } from "@/lib/supabase/server"
import { ConfigForm } from "@/components/admin/config-form"
import type { Config } from "@/lib/types"

export default async function ConfiguracionPage() {
  const supabase = await createClient()

  const { data: configData, error } = await supabase
    .from("config")
    .select("*")

  if (error) {
    console.error("Error fetching config:", error)
  }

  const config = (configData || []).reduce((acc: Record<string, string>, item: Config) => {
    acc[item.clave] = item.valor
    return acc
  }, {})

  return (
    <div>
      <h1 className="font-[var(--font-cormorant)] text-3xl font-semibold mb-8">
        Configuracion
      </h1>

      <ConfigForm config={config} />
    </div>
  )
}
