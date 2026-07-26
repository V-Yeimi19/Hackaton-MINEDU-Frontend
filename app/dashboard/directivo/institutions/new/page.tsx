import { GlassCard } from "@/components/ui/glass-card";
import { CreateInstitutionForm } from "./_components/create-institution-form";

export default function NewInstitutionPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">Crear institución</h1>
      <GlassCard className="max-w-lg">
        <CreateInstitutionForm />
      </GlassCard>
    </div>
  );
}
