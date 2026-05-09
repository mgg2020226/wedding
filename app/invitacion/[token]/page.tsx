import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { InvitacionFlow } from "@/components/wedding/invitacion-flow"
import type { Familia, Regalo, Config, Confirmacion } from "@/lib/types"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function InvitacionPage({ params }: PageProps) {
  const { token } = await params
  const supabase = await createClient()

  const { data: familia, error: familiaError } = await supabase
    .from("familias")
    .select("*")
    .eq("token", token)
    .eq("activo", true)
    .single()

  if (familiaError || !familia) {
    notFound()
  }

  const { data: confirmacion } = await supabase
    .from("confirmaciones")
    .select("*")
    .eq("familia_id", familia.id)
    .single()

  const { data: regalos } = await supabase
    .from("regalos")
    .select("*")
    .eq("activo", true)
    .order("nombre")

  const { data: configData } = await supabase
    .from("config")
    .select("*")

  const config = configData?.reduce((acc: Record<string, string>, item: Config) => {
    acc[item.clave] = item.valor
    return acc
  }, {}) || {}

  const mensajeSobres = config.mensaje_lluvia_sobres || "Tu sobre será muy apreciado."

  return (
    <main>
      <InvitacionFlow
        familia={familia as Familia}
        regalos={(regalos || []) as Regalo[]}
        mensajeSobres={mensajeSobres}
        confirmacion={(confirmacion || null) as Confirmacion | null}
      />
    </main>
  )
}
