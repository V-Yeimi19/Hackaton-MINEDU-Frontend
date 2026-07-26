# Design Patterns — captura de `docs/inspiration structure/`

> Este archivo **no reemplaza** a `docs/DESIGN.md` — lo complementa. `DESIGN.md` define los tokens y principios ("Liquid Institutional"); este archivo cataloga los **patrones de componentes concretos** observados en los 4 mockups de `docs/inspiration structure/` (`code-admin.html`, `code-directcor.html`, `code-familiar.html`, `code-professor.html`), ya traducidos a las clases/tokens que existen hoy en el proyecto (`glass-surface`, `glass-ink`, `glass-ambient`, escala tipográfica `text-*`, radios `rounded-*`, colores `primary`/`secondary`/`tertiary`/`error`).
>
> Es **solo referencia** — ninguno de estos patrones está construido todavía. Cuando se dé luz verde para aplicarlos, este documento sirve de spec para no reinterpretar el estilo desde cero.
>
> Todos los valores de color, tipografía, radio y blur citados abajo coinciden 1:1 con `docs/DESIGN.md` (mismos hex, misma escala, mismo `blur(40px)`); no se introduce ningún token nuevo.

## Divergencia a resolver antes de aplicar

Los 4 mockups no comparten un único "app shell":

- `code-admin.html` usa **solo sidebar** (nav completo a la izquierda, sin links en la topbar).
- `code-directcor.html`, `code-familiar.html`, `code-professor.html` **mezclan** links de nav en la topbar *y* un sidebar `lg:flex`/`hidden lg:flex` con el mismo contenido — redundante.

Recomendación: quedarse con **un solo layout de shell** (sidebar `glass-ink` fijo + topbar `glass-ink` sticky sin links duplicados), tal como indica `DESIGN.md` → "Sidebars: solid Secondary background... heavy vertical anchor". El proyecto hoy ya tiene una `Topbar` (`components/dashboard/topbar.tsx`) pero **ningún sidebar** — es la pieza nueva más importante que falta.

## 1. App shell

### Sidebar (`glass-ink`)
- Contenedor fijo, ancho `w-64`, altura completa, `glass-ink`.
- Bloque logo arriba: ícono en chip `bg-primary-container rounded-lg`, título `text-headline-md`, subtítulo `text-label-md text-inverse-on-surface/70` en mayúsculas con tracking.
- Lista de nav, cada item:
  - Activo: borde izquierdo `border-l-4 border-primary-container`, texto `text-primary-container font-bold`, fondo `bg-white/5`.
  - Inactivo: `text-inverse-on-surface/70`, `hover:text-primary-container hover:bg-white/10`.
  - Ícono con `group-hover:translate-x-1 transition-transform duration-200`.
- Sección inferior (mt-auto, separada por `border-t border-white/10`): botón de alerta destacado (`bg-tertiary`/`bg-error` translúcido) + links de ayuda y cerrar sesión.

### Topbar (`glass-ink`, sticky)
- Ya existe una base en `components/dashboard/topbar.tsx`; el mockup añade:
  - Buscador tipo pill: `bg-surface-container rounded-full`, ícono absoluto a la izquierda, `focus:ring-2 focus:ring-primary-container`.
  - Botones de ícono con `active:scale-95 transition-transform` y `hover:bg-white/10`.
  - Separador vertical `h-8 w-px bg-outline-variant` o `bg-white/10` entre grupos de acciones.
  - Bloque usuario: nombre + rol en `text-label-md` sobre avatar circular con borde `border-2 border-primary-container`.

## 2. Tarjetas

### KPI card
`glass-surface rounded-lg p-6` con:
- Fila superior: chip de ícono (`p-3 bg-primary-container/20 rounded-md`) + badge de tendencia (`text-xs font-bold text-primary bg-primary-container/10 px-2 py-1 rounded-full`).
- Número grande: `text-headline-lg font-extrabold`.
- Label pequeño arriba del número: `text-label-md text-on-surface-variant`.
- Barra de progreso delgada (`h-1 bg-surface-container-high rounded-full`, fill `bg-primary-container`) opcional al pie.

### Bento glass card (contenedor genérico)
`glass-surface p-6 rounded-lg` con header `flex justify-between items-center`: título `text-headline-md` + ícono acompañante, acciones a la derecha (botones o pills de filtro tipo "Monthly/Quarterly").

### Fila de lista con avatar
`flex items-center gap-3 p-3 rounded-md hover:bg-white/10`:
- Avatar circular `w-10 h-10` (o `w-8 h-8` en tablas).
- Nombre `font-bold text-sm` + meta `text-[10px]/text-xs text-on-surface-variant`.
- Estado a la derecha: punto de color (`w-2 h-2 rounded-full`) + texto `text-xs font-bold`, o badge.

### Tarjeta de alerta por severidad
`p-4 rounded-md border-l-4`, variantes:
- **Crítico**: `border-error bg-error-container/20`, texto `text-on-error-container`.
- **Advertencia**: `border-tertiary bg-tertiary-container/20` (o `bg-tertiary-fixed/20`), texto `text-on-tertiary-container`.
- **Info**: `border-primary-container bg-surface-container-high`, texto `text-on-surface`.
- Encabezado de la tarjeta: título en negrita + timestamp pequeño (`text-[10px] opacity-60`) alineados en extremos.

### Tarjeta de entidad con imagen
`glass-surface rounded-lg overflow-hidden`:
- Banner `h-40` con `object-cover`, badge superpuesto `absolute top-4 right-4 rounded-full px-3 py-1` (color según estado: `bg-primary-container` positivo / `bg-tertiary-container` alerta).
- Cuerpo `p-6`: título + meta con ícono inline, fila de stats separada por `divisor vertical h-8 w-px bg-outline-variant` entre cada stat (número `font-bold text-primary` + label `text-[10px] uppercase`).

## 3. Tabla de datos

- Contenedor `glass-surface overflow-hidden`, `overflow-x-auto` interno.
- `thead`: fondo `bg-surface-container-low`, texto `text-on-surface-variant`, borde inferior `border-b border-outline-variant/30`, headers en `text-label-md` mayúsculas.
- `tbody tr`: `hover:bg-primary-container/5 transition-colors`, separador `divide-y divide-outline-variant/20`.
- Celda identidad: avatar + nombre en negrita + email/meta pequeño debajo.
- Celda rol: pill `rounded-full text-[10px] font-bold` con fondo de baja opacidad del color semántico del rol.
- Celda estado: punto de color + texto (`animate-pulse` solo para "activo ahora mismo").
- Celda acción: ícono `more_vert`/kebab, `text-on-surface-variant hover:text-primary cursor-pointer`.

## 4. Botones

- **Primario**: fondo sólido `bg-primary-container` (o `bg-primary` para CTAs de mayor jerarquía), texto blanco/`on-primary-container`, `rounded-lg` (contenedores) o `rounded-full` (pills de acción), `hover:brightness-110`, `active:scale-95`.
- **Secundario**: transparente con borde `border border-outline` o `border-secondary`, texto del mismo color, `hover:bg-secondary/5` o `hover:bg-white/10`.
- **Ícono "ghost"**: solo ícono, `p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all`.
- **Destructivo**: mismo patrón que primario/secundario pero con `error`/`tertiary` en vez de `primary`.

## 5. Badges / chips

- `rounded-full px-2 py-1` (o `px-3 py-1` más grandes), relleno de baja opacidad del color semántico (`/10` a `/20`) + texto saturado del mismo color.
- Labels de metadata: `text-[10px] font-bold uppercase tracking-wider`.

## 6. Barras de progreso

- Track: `h-1`–`h-2 bg-surface-container rounded-full overflow-hidden` (usar `bg-surface-container-highest` si el fondo de la card ya es `surface-container`).
- Fill: `bg-primary-container` (o `bg-primary`) para progreso normal; `bg-tertiary` para "riesgo"/vencido, según `DESIGN.md` → "Progress Bars: Cyan para completion, Red para Risk/Overdue".

## 7. Floating Action Button (FAB)

`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center bg-primary (o bg-primary-container) text-white hover:scale-110 active:scale-95 transition-all z-50`.

## 8. Iconografía

Los mockups usan Google *Material Symbols Outlined*; el proyecto usa `lucide-react`. No se traduce ícono por ícono — se replica el **patrón de uso**:
- Ícono pequeño dentro de un chip de color (`p-2`/`p-3` + fondo `/10`–`/20` del color semántico).
- Ícono inline antes de un label de nav/lista (`gap-2`/`gap-3`).
- Ícono con `group-hover:translate-x-1` en links de nav para dar sensación de dirección.

## 9. Micro-interacciones

- Lift de card en hover: `hover:-translate-y-1` (o `transform: translateY(-4px)` vía JS en el mockup — no hace falta el JS, un `transition-transform hover:-translate-y-1` en CSS logra el mismo efecto).
- Specular highlight ("shine") de los glass cards: el mockup lo simulaba con seguimiento de mouse por JS (`--mouse-x`/`--mouse-y`); **no es necesario replicarlo** — `.glass-surface::before` en `app/globals.css` ya resuelve el mismo efecto visual de forma estática vía gradiente diagonal fijo.
- Botones con `active:scale-95` en toda interacción clickeable (ya es un patrón consistente en los 4 mockups).
