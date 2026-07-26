"use client";

import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function InviteTeacherForm({ institutionId }: { institutionId: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const invitation = await classroomApi.invitations.create(
        { email, type: "TEACHER_TO_INSTITUTION", institutionId },
        token
      );
      setInviteLink(`${window.location.origin}/invitations/${invitation.token}`);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la invitación");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Correo del docente"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldError message={error} />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Invitando..." : "Invitar docente"}
        </Button>
      </form>
      {inviteLink && (
        <p className="break-all rounded-md bg-surface-container-high p-3 text-label-md text-on-surface-variant">
          Link de invitación: {inviteLink}
        </p>
      )}
    </div>
  );
}
