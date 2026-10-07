/**
 * Re-export navigation helpers from routing config so components can import
 * from a stable path (`@/i18n/navigation`) regardless of internal layout.
 *
 * @see ./routing.ts
 */
export {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} from './routing';