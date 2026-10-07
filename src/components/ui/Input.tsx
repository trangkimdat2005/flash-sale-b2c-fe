"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, id, ...rest }, ref) => {
    const inputId = id ?? `input-${rest.name ?? Math.random().toString(36).slice(2)}`;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "block h-11 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:ring-2 focus:ring-red-500/40 focus:border-red-500 dark:bg-zinc-900 dark:text-zinc-100",
              leftIcon && "pl-10",
              error
                ? "border-rose-500"
                : "border-zinc-300 dark:border-zinc-700",
              className
            )}
            {...rest}
          />
        </div>
        {hint && !error && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {hint}
          </p>
        )}
        {error && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";