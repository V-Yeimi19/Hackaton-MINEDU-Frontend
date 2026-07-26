import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  BellRing,
  BookOpenCheck,
  Building2,
  CalendarCheck2,
  FileCheck2,
  FileText,
  GraduationCap,
  Mic2,
  Puzzle,
  Radar,
  ShieldCheck,
  Sparkles,
  Subtitles,
  UserRound,
  Users,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import appIcon from "@/app/icon.png";

const roles = [
  {
    key: "ADMIN",
    label: "Administrador",
    icon: ShieldCheck,
    description:
      "Visibilidad total de la plataforma: usuarios, instituciones, aulas y reportes de todo el sistema.",
    capabilities: [
      "Gestiona usuarios y cambia roles",
      "Ve todas las instituciones y aulas",
      "Accede a reportes institucionales agregados",
    ],
  },
  {
    key: "DIRECTIVO",
    label: "Directivo",
    icon: Building2,
    description:
      "Director de una institución educativa: crea la IE, invita docentes y supervisa el desempeño institucional.",
    capabilities: [
      "Crea y administra su institución educativa",
      "Invita docentes por correo con link de aceptación",
      "Genera reportes institucionales en CSV y PDF",
    ],
  },
  {
    key: "DOCENTE",
    label: "Docente",
    icon: GraduationCap,
    description:
      "Dueño del aula: organiza cursos, registra asistencia y notas, e invita a las familias de sus estudiantes.",
    capabilities: [
      "Crea aulas, cursos y evalúa competencias",
      "Registra asistencia y notas por estudiante",
      "Genera reportes semanales con IA y fichas accesibles",
    ],
  },
  {
    key: "FAMILIAR",
    label: "Familiar",
    icon: Users,
    description:
      "Padre o madre de familia: registra a sus hijos, acepta invitaciones de matrícula y sigue su progreso.",
    capabilities: [
      "Registra a sus hijos y sus necesidades de apoyo",
      "Acepta invitaciones de matrícula por aula",
      "Ve asistencia, notas y recomendaciones de sus hijos",
    ],
  },
];

const flowSteps = [
  {
    title: "Regístrate y elige tu rol",
    description:
      "Cada cuenta nace con un rol —admin, directivo, docente o familiar— que define exactamente qué puede ver y hacer.",
  },
  {
    title: "Directivo arma la institución",
    description:
      "Crea la IE e invita a sus docentes por correo; cada invitación llega con un link de aceptación único.",
  },
  {
    title: "Docente organiza el aula",
    description:
      "Crea aulas y cursos, registra asistencia y notas, e invita a las familias a matricular a sus hijos.",
  },
  {
    title: "Familia hace seguimiento",
    description:
      "Ve en tiempo real la asistencia, las notas y las recomendaciones de riesgo de cada hijo matriculado.",
  },
];

const features = [
  {
    icon: Radar,
    title: "Gemelo digital y riesgo",
    description:
      "Cada estudiante tiene un snapshot en vivo de asistencia, notas y competencias, con nivel de riesgo (bajo, medio, alto, crítico) y recomendaciones accionables para el docente.",
  },
  {
    icon: CalendarCheck2,
    title: "Asistencia y notas en un clic",
    description:
      "Registro de asistencia por lote, notas por evaluación y evaluación de competencias — todo recalcula los indicadores del aula automáticamente.",
  },
  {
    icon: Sparkles,
    title: "Reportes semanales con IA",
    description:
      "Cada aula recibe un reporte PDF semanal con resumen de asistencia, notas y anomalías detectadas automáticamente por estudiante.",
  },
  {
    icon: FileText,
    title: "Reportes institucionales",
    description:
      "CSV y PDF agregados por institución, aula o estudiante — a demanda o por cron semanal, listos para descargar.",
  },
  {
    icon: BellRing,
    title: "Notificaciones en tiempo real",
    description:
      "Invitaciones aceptadas, nuevas cuentas y alertas de riesgo llegan al instante por WebSocket, sin recargar la página.",
  },
  {
    icon: BookOpenCheck,
    title: "Invitaciones por link",
    description:
      "Docentes y familias se incorporan mediante invitaciones firmadas por token — sin contraseñas compartidas ni matrículas manuales.",
  },
];

const accessibilityPipeline = [
  { icon: FileText, label: "OCR del material" },
  { icon: Sparkles, label: "Texto adaptado" },
  { icon: Mic2, label: "Audio narrado" },
  { icon: Subtitles, label: "Subtítulos SRT" },
  { icon: Puzzle, label: "Pictogramas ARASAAC" },
  { icon: FileCheck2, label: "Ficha didáctica PDF" },
];

export default function Home() {
  return (
    <div className="glass-ambient flex flex-1 flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
              <Image
                src={appIcon}
                alt="Aula Digital"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <span className="text-label-md uppercase tracking-wide text-on-surface">
              Aula Digital
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-body-md text-on-surface-variant md:flex">
            <a href="#roles" className="hover:text-on-surface">
              Roles
            </a>
            <a href="#funcionalidades" className="hover:text-on-surface">
              Funcionalidades
            </a>
            <a href="#accesibilidad" className="hover:text-on-surface">
              Accesibilidad
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-body-md font-medium text-on-primary transition-opacity hover:opacity-90"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full bg-primary-container/30 px-4 py-1.5 text-label-md uppercase tracking-wide text-on-primary-container">
              Educación Básica Especial
            </span>
            <h1 className="text-display-lg text-balance text-on-surface">
              Toda la gestión educativa de tu institución, en un solo lugar
            </h1>
            <p className="max-w-xl text-body-lg text-on-surface-variant">
              Una plataforma para directivos, docentes y familias: asistencia,
              notas y competencias en tiempo real, un gemelo digital que
              detecta riesgo temprano, reportes con IA y un pipeline de
              accesibilidad inclusiva para cada estudiante.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/register"
                className="rounded-md bg-primary px-6 py-3 text-body-md font-medium text-on-primary shadow-[0_8px_32px_0_rgba(0,104,118,0.25)] transition-opacity hover:opacity-90"
              >
                Crear cuenta gratis
              </Link>
              <a
                href="#roles"
                className="rounded-md border border-ink px-6 py-3 text-body-md font-medium text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Ver roles y funciones
              </a>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 text-label-md text-on-surface-variant">
              
              <span className="flex items-center gap-2">
                <Activity size={16} className="text-primary" /> Riesgo en
                tiempo real
              </span>
              <span className="flex items-center gap-2">
                <Puzzle size={16} className="text-primary" /> Accesibilidad
                inclusiva
              </span>
            </div>
          </div>

          <GlassCard className="relative overflow-hidden p-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop"
                alt="Docente presentando frente a estudiantes en un aula"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 640px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <GlassCard tone="ink" className="p-4">
                  <p className="text-label-md uppercase tracking-wide text-inverse-primary">
                    Gemelo digital
                  </p>
                  <p className="text-body-md">
                    3 estudiantes en riesgo detectados esta semana
                  </p>
                </GlassCard>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Flow */}
        <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Cómo funciona
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Del registro a la matrícula, cada paso conecta al rol
              correspondiente sin fricción.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {flowSteps.map((step, index) => (
              <GlassCard key={step.title} className="flex flex-col gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-label-md font-semibold text-on-primary">
                  {index + 1}
                </span>
                <h3 className="text-body-lg font-semibold text-on-surface">
                  {step.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {step.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Un rol para cada responsabilidad
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Los permisos están definidos por rol desde el primer login —
              cada quien ve exactamente lo que necesita.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <GlassCard key={role.key} className="flex flex-col gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary-container text-secondary">
                  <role.icon size={22} />
                </div>
                <div>
                  <span className="text-label-md uppercase tracking-wide text-primary">
                    {role.key}
                  </span>
                  <h3 className="text-body-lg font-semibold text-on-surface">
                    {role.label}
                  </h3>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  {role.description}
                </p>
                <ul className="flex flex-col gap-2 border-t border-outline-variant/60 pt-4 text-body-md text-on-surface-variant">
                  {role.capabilities.map((capability) => (
                    <li key={capability} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="funcionalidades"
          className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10"
        >
          <div className="mb-10 max-w-2xl">
            <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Funcionalidades
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Todo lo que corre por debajo, traducido a herramientas simples
              para el día a día del aula.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <GlassCard key={feature.title} className="flex flex-col gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-container/25 text-primary">
                  <feature.icon size={22} />
                </div>
                <h3 className="text-body-lg font-semibold text-on-surface">
                  {feature.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Accessibility showcase */}
        <section
          id="accesibilidad"
          className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10"
        >
          <GlassCard className="grid gap-10 overflow-hidden p-8 lg:grid-cols-2 lg:p-10">
            <div className="flex flex-col gap-5">
              <span className="w-fit rounded-full bg-tertiary-container/30 px-4 py-1.5 text-label-md uppercase tracking-wide text-on-tertiary-container">
                Educación Básica Especial
              </span>
              <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
                Material adaptado para cada estudiante
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Un solo archivo sube y baja convertido en texto de lectura
                fácil, audio narrado, subtítulos, pictogramas ARASAAC y una
                ficha didáctica en PDF — personalizada según las necesidades
                de apoyo registradas del estudiante (TEA, TDAH, discapacidad
                visual o auditiva, entre otras).
              </p>
              <div className="flex flex-col gap-3 pt-2">
                {accessibilityPipeline.map((step, index) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary-container/25 text-tertiary">
                      <step.icon size={16} />
                    </span>
                    <span className="text-body-md text-on-surface">
                      {step.label}
                    </span>
                    {index < accessibilityPipeline.length - 1 && (
                      <span className="h-px flex-1 bg-outline-variant" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-md">
              <Image
                src="https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?q=80&w=1400&auto=format&fit=crop"
                alt="Estudiantes trabajando en un aula inclusiva"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
          </GlassCard>
        </section>

        {/* Digital twin / risk callout */}
        <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
          <GlassCard tone="ink" className="grid gap-10 p-8 lg:grid-cols-2 lg:p-10">
            <div className="relative min-h-[240px] overflow-hidden rounded-md order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1400&auto=format&fit=crop"
                alt="Docente acompañando a un grupo de estudiantes"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
            <div className="order-1 flex flex-col justify-center gap-4 lg:order-2">
              <span className="flex items-center gap-2 text-label-md uppercase tracking-wide text-inverse-primary">
                <Radar size={16} /> Gemelo digital
              </span>
              <h2 className="text-headline-lg-mobile sm:text-headline-lg">
                Detecta el riesgo antes de que se convierta en abandono
              </h2>
              <p className="text-body-md text-inverse-on-surface/80">
                Cada vez que se registra asistencia, una nota o una
                competencia, el sistema recalcula el indicador del estudiante
                y su nivel de riesgo — bajo, medio, alto o crítico — y genera
                recomendaciones concretas para el docente.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="rounded-full bg-error/20 px-3 py-1 text-label-md text-tertiary-container">
                  Crítico
                </span>
                <span className="rounded-full bg-tertiary-container/20 px-3 py-1 text-label-md text-tertiary-container">
                  Alto
                </span>
                <span className="rounded-full bg-primary-container/20 px-3 py-1 text-label-md text-inverse-primary">
                  Medio
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-label-md text-inverse-on-surface">
                  Bajo
                </span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
          <GlassCard className="flex flex-col items-center gap-5 p-10 text-center">
            <UserRound size={28} className="text-primary" />
            <h2 className="text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Crea tu cuenta y elige tu rol
            </h2>
            <p className="max-w-xl text-body-md text-on-surface-variant">
              Directivo, docente o familiar — el registro toma menos de un
              minuto y cada rol arranca con su propio flujo guiado.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="rounded-md bg-primary px-6 py-3 text-body-md font-medium text-on-primary transition-opacity hover:opacity-90"
              >
                Crear cuenta
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-ink px-6 py-3 text-body-md font-medium text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </GlassCard>
        </section>
      </main>

      <footer className="border-t border-outline-variant/40 bg-surface/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-body-md text-on-surface-variant sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
              <Image
                src={appIcon}
                alt="Aula Digital"
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
            <span>Aula Digital</span>
          </div>
          <p className="text-label-md">
            Proyecto de hackathon de gestión educativa inclusiva
          </p>
        </div>
      </footer>
    </div>
  );
}
