"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button, FieldError, Input, Label, Select } from "@/components/ui/form";
import { useAuth } from "@/lib/auth/auth-context";
import { registerDtoSchema } from "@/lib/api/schemas/auth";
import { roleHomePath } from "@/lib/auth/role-home";

const ROLE_OPTIONS = [
  { value: "DOCENTE", label: "Docente" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "DIRECTIVO", label: "Directivo" },
  { value: "ADMIN", label: "Administrador" },
] as const;

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]["value"]>("DOCENTE");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    const parsed = registerDtoSchema.safeParse({ fullName, email, password, role });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(parsed.data);
      router.push(searchParams.get("redirect") || roleHomePath(user.role));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="glass-ambient flex min-h-screen items-center justify-center px-6 py-16">
      <GlassCard className="w-full max-w-md">
        <h1 className="text-headline-md text-on-surface">Crear cuenta</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Elige tu rol para acceder a las herramientas correspondientes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Rol</Label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <FieldError message={error} />

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-body-md text-on-surface-variant">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
