"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function RemoveEnrollmentButton({
  classroomId,
  enrollmentId,
}: {
  classroomId: string;
  enrollmentId: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleRemove() {
    if (!window.confirm("¿Remover a este estudiante del aula?")) return;

    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.classrooms.removeEnrollment(classroomId, enrollmentId, token);
      router.refresh();
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={submitting}
      className="rounded-full px-1.5 text-body-sm text-error hover:bg-error/10 disabled:opacity-50"
      title="Remover estudiante"
    >
      ✕
    </button>
  );
}
