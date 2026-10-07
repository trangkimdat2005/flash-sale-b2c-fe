"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
  children: React.ReactNode;
}

const variants = {
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}