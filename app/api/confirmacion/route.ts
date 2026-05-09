import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { familia_id, asiste, integrantes, opcion_regalo, regalo_id, mensaje } = body

    if (!familia_id || asiste === undefined) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if family exists and is active
    const { data: familia, error: familiaError } = await supabase
      .from("familias")
      .select("*")
      .eq("id", familia_id)
      .eq("activo", true)
      .single()

    if (familiaError || !familia) {
      return NextResponse.json(
        { error: "Familia no encontrada o inactiva" },
        { status: 404 }
      )
    }

    // Check if already confirmed
    const { data: existingConfirmacion } = await supabase
      .from("confirmaciones")
      .select("id")
      .eq("familia_id", familia_id)
      .single()

    if (existingConfirmacion) {
      return NextResponse.json(
        { error: "Ya existe una confirmacion para esta familia" },
        { status: 400 }
      )
    }

    // Validate guest count
    if (asiste && integrantes && integrantes.length > familia.cupos) {
      return NextResponse.json(
        { error: `Maximo ${familia.cupos} invitados permitidos` },
        { status: 400 }
      )
    }

    // Create confirmation
    const { data: confirmacion, error: confirmacionError } = await supabase
      .from("confirmaciones")
      .insert({
        familia_id,
        asiste,
        opcion_regalo: asiste ? opcion_regalo : null,
        regalo_id: asiste && opcion_regalo === "lista" ? regalo_id : null,
        mensaje,
      })
      .select()
      .single()

    if (confirmacionError) {
      console.error("Error creating confirmacion:", confirmacionError)
      return NextResponse.json(
        { error: "Error al crear confirmacion" },
        { status: 500 }
      )
    }

    // Add guests if attending
    if (asiste && integrantes && integrantes.length > 0) {
      const integrantesData = integrantes.map((i: { nombre: string; es_mayor: boolean }) => ({
        confirmacion_id: confirmacion.id,
        nombre: i.nombre,
        es_mayor: i.es_mayor,
      }))

      const { error: integrantesError } = await supabase
        .from("integrantes")
        .insert(integrantesData)

      if (integrantesError) {
        console.error("Error adding integrantes:", integrantesError)
        // Don't fail the whole request, confirmation is already created
      }
    }

    return NextResponse.json({ success: true, confirmacion })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
