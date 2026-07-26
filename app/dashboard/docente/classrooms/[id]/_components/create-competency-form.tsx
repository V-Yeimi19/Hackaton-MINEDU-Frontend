"use client";

import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function CreateCompetencyForm() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setSuccess(false);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.competencies.create({ name, area }, token);
      setName("");
      setArea("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la competencia");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          placeholder="Nombre (ej. Comprende textos)"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Input
          placeholder="Área (ej. Comunicación)"
          required
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creando..." : "Crear competencia"}
        </Button>
      </div>
      <FieldError message={error} />
      {success && <p className="text-label-md text-primary">Competencia creada.</p>}
    </form>
  );
}
