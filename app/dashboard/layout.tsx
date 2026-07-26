import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/api/token.server";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Topbar user={user} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}
