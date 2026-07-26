"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input, Label } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function CreateInstitutionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const token = getClientToken();
    if (!token) {
      setError("Sesión expirada, vuelve a iniciar sesión.");
      return;
    }

    setSubmitting(true);
    try {
      await classroomApi.institutions.create(
        { name, code: code || undefined, address: address || undefined },
        token
      );
      router.push("/dashboard/directivo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la institución");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la institución</Label>
        <Input
          id="name"
          required
          placeholder="IEP San Martín"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="code">Código (opcional)</Label>
        <Input
          id="code"
          placeholder="001"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Dirección (opcional)</Label>
        <Input
          id="address"
          placeholder="Av. Principal 123"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <FieldError message={error} />
      <Button type="submit" disabled={submitting} className="mt-2">
        {submitting ? "Creando..." : "Crear institución"}
      </Button>
    </form>
  );
}
