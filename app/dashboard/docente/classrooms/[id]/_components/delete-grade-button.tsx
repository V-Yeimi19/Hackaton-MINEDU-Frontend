"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function DeleteGradeButton({ gradeId }: { gradeId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("¿Eliminar esta nota?")) return;
    const token = getClientToken();
    if (!token) return;

    setDeleting(true);
    try {
      await classroomApi.grades.remove(gradeId, token);
      router.refresh();
    } catch {
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-on-surface-variant hover:text-error transition-colors text-title-md leading-none disabled:opacity-50"
    >
      ×
    </button>
  );
}
