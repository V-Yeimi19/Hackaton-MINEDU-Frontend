import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/api/token.server";
import { roleHomePath } from "@/lib/auth/role-home";

export default async function DirectivoLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "DIRECTIVO" && user.role !== "ADMIN") redirect(roleHomePath(user.role));

  return <>{children}</>;
}
