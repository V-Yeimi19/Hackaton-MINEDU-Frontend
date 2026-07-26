import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/api/token.server";
import { Topbar } from "@/components/dashboard/topbar";
import { Sidebar, MobileNav } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar role={user.role} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar user={user} />
        <MobileNav role={user.role} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
