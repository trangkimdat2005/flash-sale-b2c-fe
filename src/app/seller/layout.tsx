import type { ReactNode } from "react";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import { PortalTopbar } from "@/components/common/PortalTopbar";
import { MinWidthGuard } from "@/components/common/MinWidthGuard";

/**
 * Layout Seller Center – chỉ desktop (≥1280px, rule §10).
 */
export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page">
      <PortalTopbar title="Seller Center" />
      <div className="mx-auto flex w-full max-w-[1440px]">
        <SellerSidebar />
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 lg:p-6">
          <MinWidthGuard minWidth={1280} fallbackMessage="Vui lòng dùng máy tính để truy cập Seller Center.">
            {children}
          </MinWidthGuard>
        </main>
      </div>
    </div>
  );
}
