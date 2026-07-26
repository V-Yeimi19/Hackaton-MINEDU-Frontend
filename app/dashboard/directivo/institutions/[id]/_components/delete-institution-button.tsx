"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function DeleteInstitutionButton({ institutionId }: { institutionId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta institución? Esta acción no se puede deshacer.")) return;

    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.institutions.remove(institutionId, token);
      router.push("/dashboard/directivo");
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleDelete} disabled={submitting}>
      {submitting ? "Eliminando..." : "Eliminar institución"}
    </Button>
  );
}
