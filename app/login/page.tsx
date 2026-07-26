"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button, FieldError, Input, Label } from "@/components/ui/form";
import { useAuth } from "@/lib/auth/auth-context";
import { loginDtoSchema } from "@/lib/api/schemas/auth";
import { roleHomePath } from "@/lib/auth/role-home";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    const parsed = loginDtoSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(parsed.data);
      router.push(searchParams.get("redirect") || roleHomePath(user.role));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="glass-ambient flex min-h-screen items-center justify-center px-6 py-16">
      <GlassCard className="w-full max-w-md">
        <h1 className="text-headline-md text-on-surface">Iniciar sesión</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Accede a tu panel de Aula Digital.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <FieldError message={error} />

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="mt-6 text-body-md text-on-surface-variant">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
