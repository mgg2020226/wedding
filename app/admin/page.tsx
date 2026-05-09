import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Gift, CheckSquare, UserCheck, UserX, Clock } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: totalFamilias },
    { count: totalRegalos },
    { count: totalConfirmaciones },
    { data: confirmaciones },
    { data: integrantes },
  ] = await Promise.all([
    supabase.from("familias").select("*", { count: "exact", head: true }),
    supabase.from("regalos").select("*", { count: "exact", head: true }),
    supabase.from("confirmaciones").select("*", { count: "exact", head: true }),
    supabase.from("confirmaciones").select("asiste"),
    supabase.from("integrantes").select("es_mayor"),
  ])

  const asistentes = confirmaciones?.filter(c => c.asiste).length || 0
  const noAsistentes = confirmaciones?.filter(c => !c.asiste).length || 0
  const pendientes = (totalFamilias || 0) - (totalConfirmaciones || 0)
  const totalInvitados = integrantes?.length || 0
  const adultos = integrantes?.filter(i => i.es_mayor).length || 0
  const menores = integrantes?.filter(i => !i.es_mayor).length || 0

  const stats = [
    { 
      title: "Familias Invitadas", 
      value: totalFamilias || 0, 
      icon: Users,
      href: "/admin/familias",
      color: "text-blue-600"
    },
    { 
      title: "Confirmaciones", 
      value: totalConfirmaciones || 0, 
      icon: CheckSquare,
      href: "/admin/confirmaciones",
      color: "text-green-600"
    },
    { 
      title: "Asistiran", 
      value: asistentes, 
      icon: UserCheck,
      href: "/admin/confirmaciones",
      color: "text-emerald-600"
    },
    { 
      title: "No Asistiran", 
      value: noAsistentes, 
      icon: UserX,
      href: "/admin/confirmaciones",
      color: "text-red-500"
    },
    { 
      title: "Pendientes", 
      value: pendientes, 
      icon: Clock,
      href: "/admin/familias",
      color: "text-amber-600"
    },
  ]

  return (
    <div>
      <h1 className="font-[var(--font-cormorant)] text-3xl font-semibold mb-8">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Guest Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-[var(--font-cormorant)] text-xl">
            Resumen de Invitados Confirmados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-3xl font-bold text-foreground">{totalInvitados}</p>
              <p className="text-sm text-muted-foreground">Total Invitados</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-3xl font-bold text-foreground">{adultos}</p>
              <p className="text-sm text-muted-foreground">Adultos</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-3xl font-bold text-foreground">{menores}</p>
              <p className="text-sm text-muted-foreground">Menores</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
