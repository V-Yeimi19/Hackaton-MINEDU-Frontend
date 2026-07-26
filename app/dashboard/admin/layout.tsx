import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/api/token.server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard/directivo");

  return <>{children}</>;
}
