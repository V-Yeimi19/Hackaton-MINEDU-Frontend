import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "surface" | "ink";
};

export function GlassCard({
  className,
  tone = "surface",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-6",
        tone === "surface" ? "glass-surface" : "glass-ink",
        className
      )}
      {...props}
    />
  );
}
