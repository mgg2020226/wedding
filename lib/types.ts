export interface Familia {
  id: string
  token: string
  apellido: string
  cupos: number
  creado_en: string
  activo: boolean
}

export interface Regalo {
  id: string
  nombre: string
  descripcion: string | null
  imagen_url: string | null
  enlace_url: string | null
  cupos_total: number
  cupos_usados: number
  activo: boolean
  creado_en: string
}

export interface Confirmacion {
  id: string
  familia_id: string
  asiste: boolean
  opcion_regalo: 'lista' | 'sobres' | 'ninguno' | null
  regalo_id: string | null
  mensaje: string | null
  confirmado_en: string
}

export interface Integrante {
  id: string
  confirmacion_id: string
  nombre: string
  es_mayor: boolean
}

export interface Config {
  clave: string
  valor: string
}

export interface ConfirmacionConIntegrantes extends Confirmacion {
  integrantes: Integrante[]
  familias?: Familia
  regalos?: Regalo
}
