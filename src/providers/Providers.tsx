"use client";

import { useState, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastViewport } from "@/components/ui";
import { WsConnectionProvider } from "./WsConnectionProvider";
import { SessionCookieBridge } from "@/components/layout/SessionCookieBridge";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WsConnectionProvider>
        <SessionCookieBridge />
        {children}
        <ToastViewport />
      </WsConnectionProvider>
    </QueryClientProvider>
  );
}