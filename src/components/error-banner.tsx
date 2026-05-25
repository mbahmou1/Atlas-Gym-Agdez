"use client";

import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BannerVariant = "error" | "success";

export function ErrorBanner({
  message,
  variant = "error",
  onDismiss,
  className,
}: {
  message: string;
  variant?: BannerVariant;
  onDismiss?: () => void;
  className?: string;
}) {
  if (!message) return null;

  const isError = variant === "error";

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
        isError
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        className
      )}
    >
      <AlertCircle className={cn("h-4 w-4 shrink-0 mt-0.5", !isError && "text-emerald-600")} />
      <p className="flex-1 leading-snug">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
