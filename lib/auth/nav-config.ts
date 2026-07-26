import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Building2,
  GraduationCap,
  Mail,
  School,
  UserCircle,
  Users,
} from "lucide-react";
import type { SessionUser } from "@/lib/api/token";

export const ROLE_LABEL: Record<SessionUser["role"], string> = {
  ADMIN: "Administrador",
  DIRECTIVO: "Directivo",
  DOCENTE: "Docente",
  FAMILIAR: "Familiar",
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: Record<SessionUser["role"], NavItem[]> = {
  ADMIN: [
    { href: "/dashboard/directivo", label: "Instituciones", icon: Building2 },
    { href: "/dashboard/admin/users", label: "Gestión de usuarios", icon: Users },
    { href: "/dashboard/directivo/profile", label: "Mi perfil", icon: UserCircle },
  ],
  DIRECTIVO: [
    { href: "/dashboard/directivo", label: "Mis instituciones", icon: Building2 },
    { href: "/dashboard/directivo/invitations", label: "Mis invitaciones", icon: Mail },
    { href: "/dashboard/directivo/profile", label: "Mi perfil", icon: UserCircle },
  ],
  DOCENTE: [
    { href: "/dashboard/docente", label: "Mis aulas", icon: School },
    { href: "/dashboard/docente/accessibility", label: "Accesibilidad", icon: Accessibility },
    { href: "/dashboard/docente/invitations", label: "Mis invitaciones", icon: Mail },
    { href: "/dashboard/docente/profile", label: "Mi perfil", icon: UserCircle },
  ],
  FAMILIAR: [
    { href: "/dashboard/familiar", label: "Mi(s) hij@(s)", icon: GraduationCap },
  ],
};
