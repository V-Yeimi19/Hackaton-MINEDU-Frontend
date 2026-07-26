import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "primary" | "error" | "tertiary" | "neutral";

const TONE_CLASSES: Record<BadgeTone, string> = {
  primary: "bg-primary/20 text-primary",
  error: "bg-error/20 text-error",
  tertiary: "bg-tertiary/20 text-tertiary",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-label-md font-medium",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    />
  );
}
