"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function EditCourseForm({ course }: { course: { id: string; name: string } }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(course.name);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.courses.update(course.id, { name }, token);
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el curso");
    } finally {
      setSubmitting(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="rounded-full bg-primary-container/25 px-3 py-1 text-label-md text-on-primary-container hover:opacity-80"
      >
        {course.name}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-auto min-w-32 py-1 px-2 text-label-md"
      />
      <Button onClick={handleSave} disabled={submitting} className="py-1 px-3 text-label-md">
        {submitting ? "..." : "✓"}
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setEditing(false);
          setName(course.name);
          setError(undefined);
        }}
        className="py-1 px-3 text-label-md"
      >
        ✕
      </Button>
      <FieldError message={error} />
    </span>
  );
}
