import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/api/token.server";
import { roleHomePath } from "@/lib/auth/role-home";

export default async function FamiliarLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "FAMILIAR") redirect(roleHomePath(user.role));

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-4 text-body-md">
        <Link
          href="/dashboard/familiar"
          className="font-medium text-on-surface hover:text-primary"
        >
          Mi(s) hij@(s)
        </Link>
      </nav>
      {children}
    </div>
  );
}
