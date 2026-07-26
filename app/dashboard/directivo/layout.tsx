import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/api/token.server";
import { roleHomePath } from "@/lib/auth/role-home";

export default async function DirectivoLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "DIRECTIVO" && user.role !== "ADMIN") redirect(roleHomePath(user.role));

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-4 text-body-md">
        <Link href="/dashboard/directivo" className="font-medium text-on-surface hover:text-primary">
          Mis instituciones
        </Link>
        <Link
          href="/dashboard/directivo/invitations"
          className="text-on-surface-variant hover:text-primary"
        >
          Mis invitaciones
        </Link>
        {user.role === "ADMIN" && (
          <Link
            href="/dashboard/admin/users"
            className="text-on-surface-variant hover:text-primary"
          >
            Gestión de usuarios
          </Link>
        )}
        <Link
          href="/dashboard/directivo/profile"
          className="text-on-surface-variant hover:text-primary"
        >
          Mi perfil
        </Link>
      </nav>
      {children}
    </div>
  );
}
