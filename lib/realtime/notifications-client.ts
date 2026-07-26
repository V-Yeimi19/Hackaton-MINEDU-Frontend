import { io, type Socket } from "socket.io-client";
import { WS_URL } from "@/lib/api/config";

export function createNotificationsSocket(token: string): Socket {
  return io(`${WS_URL}/notifications`, {
    path: "/ws/notifications",
    auth: { token },
    autoConnect: true,
  });
}
