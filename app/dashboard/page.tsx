import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/api/token.server";
import { GlassCard } from "@/components/ui/glass-card";
import { roleHomePath } from "@/lib/auth/role-home";

export default async function DashboardIndexPage() {
  const user = await getServerUser();
  if (!user) redirect("/login");

  if (user.role === "DOCENTE" || user.role === "FAMILIAR") {
    redirect(roleHomePath(user.role));
  }

  if (user.role === "ADMIN" || user.role === "DIRECTIVO") {
    redirect(roleHomePath(user.role));
  }

  return (
    <GlassCard>
      <h1 className="text-headline-md text-on-surface">Próximamente</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        El panel para el rol {user.role} está en construcción.
      </p>
    </GlassCard>
  );
}
