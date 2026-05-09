# 💍 Wedding Invitation — Grace & Andrès

Aplicación web de invitación de boda con confirmación de asistencia y panel de administración.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (base de datos + autenticación)
- **Tailwind CSS** + shadcn/ui
- **pnpm**

## Funcionalidades

### Invitados
- Flujo de 3 vistas por token único:
  - **Vista 1** — sobre animado (landing)
  - **Vista 2** — información del evento con accesos a detalles y confirmación
  - **Vista 3** — detalles: fecha, lugar, dresscode
- Formulario RSVP personalizado por familia:
  - Nombre de familia y cupos disponibles
  - Lista de integrantes con nombre y si son mayores de edad
  - Mensaje opcional para los novios

### Admin (`/admin`)
- Gestión de familias invitadas (crear, editar, eliminar, copiar enlace)
- Confirmaciones con filtros y búsqueda
- Exportación a Excel de lista de invitados confirmados
- Tablas responsive (cards en mobile, tabla en desktop)

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Instalación

```bash
pnpm install
pnpm dev
```

## Estructura

```
app/
  invitacion/[token]/   # Página de invitación por token
  admin/                # Panel de administración
  api/confirmacion/     # API de confirmación RSVP
components/
  wedding/              # Flujo de invitación, formulario RSVP
  admin/                # Tablas y formularios del admin
public/
  invitacion.png        # Vista 1 — sobre
  info.png              # Vista 2 — información
  detalles.png          # Vista 3 — detalles
```
