import type { ReactNode } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

/**
 * Layout `(auth)` – Stitch 203897a8.
 * - AuthHeader fixed-top (z-50) → main cần pt-16 để không bị che
 * - Main: bg-background (Material 3 surface), flex-1, justify-center
 * - AuthFooter ở dưới cùng
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader />
      <main className="flex w-full flex-1 flex-col justify-center pt-16">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}
