"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}