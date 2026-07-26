import type { SessionUser } from "@/lib/api/token";

export function roleHomePath(role: SessionUser["role"]): string {
  switch (role) {
    case "DOCENTE":
      return "/dashboard/docente";
    case "FAMILIAR":
      return "/dashboard/familiar";
    default:
      return "/dashboard";
  }
}
