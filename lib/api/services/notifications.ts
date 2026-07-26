import { apiFetch } from "../http";
import { paginated } from "../schemas/common";
import { notificationSchema } from "../schemas/notifications";

export function listNotifications(
  token: string,
  query?: { page?: number; limit?: number }
) {
  return apiFetch("/api/notifications", {
    token,
    query,
    schema: paginated(notificationSchema),
  });
}

export function markNotificationRead(id: string, token: string) {
  return apiFetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
    token,
    schema: notificationSchema,
  });
}
