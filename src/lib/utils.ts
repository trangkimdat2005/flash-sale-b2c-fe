import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gộp className theo quy ước shadcn (clsx + tailwind-merge).
 * Dùng cho mọi component (rule §11).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
