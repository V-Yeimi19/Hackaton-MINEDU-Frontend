"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function RevokeInvitationButton({ invitationId }: { invitationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    if (!window.confirm("¿Revocar esta invitación?")) return;
    const token = getClientToken();
    if (!token) return;

    setLoading(true);
    try {
      await classroomApi.invitations.revoke(invitationId, token);
      router.refresh();
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleRevoke}
      disabled={loading}
      className="py-1.5 px-3 text-label-sm"
    >
      {loading ? "Revocando..." : "Revocar"}
    </Button>
  );
}
