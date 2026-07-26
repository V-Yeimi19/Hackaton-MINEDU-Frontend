"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("¿Eliminar este curso?")) return;

    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.courses.remove(courseId, token);
      router.refresh();
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={submitting}
      className="rounded-full px-1 text-body-sm text-error hover:bg-error/10 disabled:opacity-50"
      title="Eliminar curso"
    >
      ✕
    </button>
  );
}
