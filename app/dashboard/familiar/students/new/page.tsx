"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button, FieldError, Input, Label, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { SupportLevel, SupportNeedType } from "@/lib/api/schemas/classroom";

const SUPPORT_TYPES: SupportNeedType[] = [
  "DISCAPACIDAD_VISUAL",
  "DISCAPACIDAD_AUDITIVA",
  "DISCAPACIDAD_INTELECTUAL",
  "DISCAPACIDAD_MOTORA",
  "TRASTORNO_ESPECTRO_AUTISTA",
  "DIFICULTAD_APRENDIZAJE",
  "TDAH",
  "MULTIDISCAPACIDAD",
  "OTRO",
];
const SUPPORT_LEVELS: SupportLevel[] = ["LEVE", "MODERADO", "SIGNIFICATIVO"];

export default function NewStudentPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [hasSupportNeed, setHasSupportNeed] = useState(false);
  const [supportType, setSupportType] = useState<SupportNeedType>("OTRO");
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("MODERADO");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const student = await classroomApi.students.create(
        {
          fullName,
          birthDate: birthDate || undefined,
          supportNeeds: hasSupportNeed
            ? [{ type: supportType, level: supportLevel, description: description || undefined }]
            : undefined,
        },
        token
      );
      router.push(`/dashboard/familiar/students/${student.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar al estudiante");
      setSubmitting(false);
    }
  }

  return (
    <GlassCard className="max-w-lg">
      <h1 className="text-headline-md text-on-surface">Registrar hijo</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-body-md text-on-surface">
          <input
            type="checkbox"
            checked={hasSupportNeed}
            onChange={(e) => setHasSupportNeed(e.target.checked)}
          />
          Tiene una necesidad de apoyo
        </label>

        {hasSupportNeed && (
          <div className="flex flex-col gap-3 rounded-md border border-outline-variant p-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="supportType">Tipo</Label>
              <Select
                id="supportType"
                value={supportType}
                onChange={(e) => setSupportType(e.target.value as SupportNeedType)}
              >
                {SUPPORT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="supportLevel">Nivel</Label>
              <Select
                id="supportLevel"
                value={supportLevel}
                onChange={(e) => setSupportLevel(e.target.value as SupportLevel)}
              >
                {SUPPORT_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        <FieldError message={error} />
        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? "Registrando..." : "Registrar hijo"}
        </Button>
      </form>
    </GlassCard>
  );
}
