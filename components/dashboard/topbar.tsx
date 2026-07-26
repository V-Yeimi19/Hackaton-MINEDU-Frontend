"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NotificationsBell } from "./notifications-bell";
import { useAuth } from "@/lib/auth/auth-context";
import type { SessionUser } from "@/lib/api/token";

const ROLE_LABEL: Record<SessionUser["role"], string> = {
  ADMIN: "Administrador",
  DIRECTIVO: "Directivo",
  DOCENTE: "Docente",
  FAMILIAR: "Familiar",
};

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
      <div>
        <p className="text-body-md font-medium">{user.fullName}</p>
        <p className="text-label-md text-inverse-on-surface/70">{ROLE_LABEL[user.role]}</p>
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
