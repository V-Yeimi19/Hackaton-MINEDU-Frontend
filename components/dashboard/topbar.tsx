"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { NotificationsBell } from "./notifications-bell";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_LABEL } from "@/lib/auth/nav-config";
import type { SessionUser } from "@/lib/api/token";
import appIcon from "@/app/icon.png";

export function Topbar({ user }: { user: SessionUser }) {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="glass-ink sticky top-0 z-40 flex items-center justify-between rounded-none px-6 py-4 sm:px-10">
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full lg:hidden">
          <Image src={appIcon} alt="Aula Digital" fill className="object-cover" sizes="32px" />
        </div>
        <div>
          <p className="text-body-md font-medium">{user.fullName ?? user.email}</p>
          <p className="text-label-md text-inverse-on-surface/70">{ROLE_LABEL[user.role]}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsBell />
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full text-inverse-on-surface transition-colors hover:bg-white/10"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
