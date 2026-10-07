"use client";

import { useUIStore } from "@/stores";
import { useToastAutoDismiss } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const styles = {
  success: "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800",
  error: "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950 dark:text-rose-100 dark:border-rose-800",
  info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800",
  warning: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800",
};

export function ToastViewport() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} type={t.type} message={t.message} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  onDismiss: () => void;
}

function ToastItem({ id, type, message, onDismiss }: ToastItemProps) {
  // Auto-dismiss sau 4s
  useToastAutoDismiss(id, 4000);
  return (
    <button
      type="button"
      onClick={onDismiss}
      className={cn(
        "pointer-events-auto rounded-lg border px-4 py-3 text-left text-sm shadow-lg transition hover:opacity-90",
        styles[type]
      )}
      aria-live="polite"
    >
      {message}
    </button>
  );
}