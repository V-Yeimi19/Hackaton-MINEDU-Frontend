"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function DeleteSupportNeedButton({ needId }: { needId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("¿Eliminar esta necesidad de apoyo?")) return;
    const token = getClientToken();
    if (!token) return;

    setDeleting(true);
    try {
      await classroomApi.supportNeeds.remove(needId, token);
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-on-surface-variant hover:text-error transition-colors text-label-sm disabled:opacity-50"
      title="Eliminar necesidad"
    >
      ×
    </button>
  );
}
