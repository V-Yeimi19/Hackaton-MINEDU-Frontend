import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/api/token.server";
import { roleHomePath } from "@/lib/auth/role-home";

export default async function FamiliarLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "FAMILIAR") redirect(roleHomePath(user.role));

  return <>{children}</>;
}
