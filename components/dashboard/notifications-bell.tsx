"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useNotifications } from "@/lib/realtime/use-notifications";

export function NotificationsBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-inverse-on-surface transition-colors hover:bg-white/10"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-tertiary" />
        )}
      </button>

      {open && (
        <GlassCard
          tone="surface"
          className="absolute right-0 top-12 z-50 max-h-96 w-80 overflow-y-auto !p-2"
        >
          {notifications.length === 0 ? (
            <p className="p-3 text-body-md text-on-surface-variant">Sin notificaciones aún.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="cursor-pointer rounded-md p-3 transition-colors hover:bg-surface-container-high"
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  <p className="text-body-md font-medium text-on-surface">{n.title}</p>
                  <p className="text-label-md text-on-surface-variant">{n.message}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      )}
    </div>
  );
}
