"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function AcceptTeacherInvitationForm({ token: invitationToken }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleAccept() {
    setError(undefined);
    const authToken = getClientToken();
    if (!authToken) return;

    setSubmitting(true);
    try {
      await classroomApi.invitations.acceptTeacher({ token: invitationToken }, authToken);
      router.push("/dashboard/docente");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo aceptar la invitación");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <FieldError message={error} />
      <Button onClick={handleAccept} disabled={submitting} className="self-start">
        {submitting ? "Aceptando..." : "Unirme a la institución"}
      </Button>
    </div>
  );
}
