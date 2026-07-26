import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/api/token.server";
import { roleHomePath } from "@/lib/auth/role-home";

export default async function DocenteLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "DOCENTE") redirect(roleHomePath(user.role));

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-4 text-body-md">
        <Link href="/dashboard/docente" className="font-medium text-on-surface hover:text-primary">
          Mis aulas
        </Link>
        <Link
          href="/dashboard/docente/accessibility"
          className="text-on-surface-variant hover:text-primary"
        >
          Accesibilidad
        </Link>
        <Link
          href="/dashboard/docente/profile"
          className="text-on-surface-variant hover:text-primary"
        >
          Mi perfil
        </Link>
        <Link
          href="/dashboard/docente/invitations"
          className="text-on-surface-variant hover:text-primary"
        >
          Mis invitaciones
        </Link>
      </nav>
      {children}
    </div>
  );
}
