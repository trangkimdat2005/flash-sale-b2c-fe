"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toaster – bám rule §4 (tối đa 1 dòng) và dùng token.
 * Wrapper sonner: nếu sau này bật theme, đổi qua props.
 */
export const Toaster = (props: ToasterProps) => {
  const { theme = "light" } = useTheme();
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      richColors
      closeButton
      duration={4000}
      {...props}
    />
  );
};
