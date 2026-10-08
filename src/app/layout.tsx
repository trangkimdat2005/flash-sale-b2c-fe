import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Providers } from "@/providers/Providers";
import I18nProvider from "./I18nProvider";
import "./globals.css";

/**
 * Be Vietnam Pro – subset vietnamese, weight 400/500/600 (rule §3).
 * Gán vào CSS variable --font-be-vietnam; globals.css dùng làm --font-sans.
 */
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vibe Mart – Mua sắm Flash Sale",
    template: "%s | Vibe Mart",
  },
  description:
    "Vibe Mart – sàn thương mại điện tử B2C với Flash Sale chống bán vượt kho.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0284c7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="bg-page text-ink min-h-full flex flex-col">
        <Providers>
          <I18nProvider>{children}</I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
