"use client";

import { useState } from "react";
import { Button, FieldError, Input, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type {
  StudentSupportNeed,
  SupportNeedType,
  SupportLevel,
} from "@/lib/api/schemas/classroom";

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

const SUPPORT_LABELS: Record<SupportNeedType, string> = {
  DISCAPACIDAD_VISUAL: "Discapacidad visual",
  DISCAPACIDAD_AUDITIVA: "Discapacidad auditiva",
  DISCAPACIDAD_INTELECTUAL: "Discapacidad intelectual",
  DISCAPACIDAD_MOTORA: "Discapacidad motora",
  TRASTORNO_ESPECTRO_AUTISTA: "TEA",
  DIFICULTAD_APRENDIZAJE: "Dificultad de aprendizaje",
  TDAH: "TDAH",
  MULTIDISCAPACIDAD: "Multidiscapacidad",
  OTRO: "Otro",
};

export function EditSupportNeedForm({ need }: { need: StudentSupportNeed }) {
  const [editing, setEditing] = useState(false);
  const [type, setType] = useState<SupportNeedType>(need.type);
  const [level, setLevel] = useState<SupportLevel>(need.level);
  const [description, setDescription] = useState(need.description ?? "");
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setSuccess(false);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.supportNeeds.update(
        need.id,
        { type, level, description: description || undefined },
        token
      );
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar la necesidad"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    setType(need.type);
    setLevel(need.level);
    setDescription(need.description ?? "");
    setError(undefined);
    setSuccess(false);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2 text-body-md">
        <span className="text-on-surface-variant">{SUPPORT_LABELS[need.type]}</span>
        <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-label-sm text-on-surface-variant">
          {need.level}
        </span>
        {need.description && (
          <span className="text-on-surface-variant/70 truncate max-w-[200px]">
            — {need.description}
          </span>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="ml-auto text-on-surface-variant hover:text-primary transition-colors text-label-sm"
        >
          Editar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as SupportNeedType)}
        >
          {SUPPORT_TYPES.map((t) => (
            <option key={t} value={t}>
              {SUPPORT_LABELS[t]}
            </option>
          ))}
        </Select>
        <Select
          value={level}
          onChange={(e) => setLevel(e.target.value as SupportLevel)}
        >
          {SUPPORT_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting} className="py-1.5 px-4">
          {submitting ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className="py-1.5 px-4"
        >
          Cancelar
        </Button>
        <FieldError message={error} />
        {success && (
          <p className="text-label-md text-primary">Necesidad actualizada.</p>
        )}
      </div>
    </form>
  );
}
