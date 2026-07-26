"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { Student } from "@/lib/api/schemas/classroom";

export function AcceptInvitationForm({
  token: invitationToken,
  students,
}: {
  token: string;
  students: Student[];
}) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const authToken = getClientToken();
    if (!authToken) return;

    setSubmitting(true);
    try {
      await classroomApi.invitations.acceptFamily(
        { token: invitationToken, studentId },
        authToken
      );
      router.push(`/dashboard/familiar/students/${studentId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo aceptar la invitación");
      setSubmitting(false);
    }
  }

  if (students.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Primero debes registrar a tu hijo antes de aceptar esta invitación.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.fullName}
          </option>
        ))}
      </Select>
      <FieldError message={error} />
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Aceptando..." : "Aceptar invitación"}
      </Button>
    </form>
  );
}
