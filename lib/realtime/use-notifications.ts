"use client";

import { useCallback, useEffect, useState } from "react";
import { createNotificationsSocket } from "./notifications-client";
import { markNotificationRead } from "@/lib/api/services/notifications";
import { getClientToken } from "@/lib/api/token";
import type { Notification } from "@/lib/api/schemas/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = getClientToken();
    if (!token) return;

    const socket = createNotificationsSocket(token);
    socket.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    const token = getClientToken();
    if (!token) return;
    await markNotificationRead(id, token);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAsRead };
}
