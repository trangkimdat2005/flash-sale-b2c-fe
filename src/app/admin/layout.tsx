import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PortalTopbar } from "@/components/common/PortalTopbar";
import { MinWidthGuard } from "@/components/common/MinWidthGuard";

/** Layout Admin Console – chỉ desktop (≥1280px, rule §10). */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page">
      <PortalTopbar title="Admin Console" />
      <div className="mx-auto flex w-full max-w-[1440px]">
        <AdminSidebar />
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 lg:p-6">
          <MinWidthGuard minWidth={1280} fallbackMessage="Vui lòng dùng máy tính để truy cập Admin Console.">
            {children}
          </MinWidthGuard>
        </main>
      </div>
    </div>
  );
}
