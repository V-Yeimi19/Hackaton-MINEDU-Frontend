"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { analyticsApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function DismissRecommendationButton({ id }: { id: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    const token = getClientToken();
    if (!token) return;
    setSubmitting(true);
    try {
      await analyticsApi.recommendations.dismiss(id, token);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={submitting}
      className="shrink-0 rounded-md border border-outline-variant px-3 py-1.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-50"
    >
      Descartar
    </button>
  );
}
