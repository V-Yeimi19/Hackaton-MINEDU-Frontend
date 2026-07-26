import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/api/token.server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard/directivo");

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-4 text-body-md">
        <Link
          href="/dashboard/directivo"
          className="text-on-surface-variant hover:text-primary"
        >
          Instituciones
        </Link>
        <Link
          href="/dashboard/admin/users"
          className="font-medium text-on-surface hover:text-primary"
        >
          Gestión de usuarios
        </Link>
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
