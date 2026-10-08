import type { ReactNode } from "react";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { StorefrontShell } from "./_shell";

/**
 * Layout Storefront (rule §2).
 * - Header/Footer + Container.
 * - Header và BottomNav tự đọc pathname (client) để tô active.
 */
export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StorefrontShell>
        <StorefrontHeader />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-24 pt-6 md:pb-10">
          {children}
        </main>
        <StorefrontFooter />
      </StorefrontShell>
      <MobileBottomNav />
    </>
  );
}
