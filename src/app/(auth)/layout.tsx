import type { ReactNode } from "react";

/** Layout `(auth)` – tối giản, không header/footer người mua. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-line bg-card p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
