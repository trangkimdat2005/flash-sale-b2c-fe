import { redirect } from "next/navigation";

/**
 * Trang gốc → đẩy về Storefront (mục 9: "/" thuộc Storefront).
 * Locale mặc định "vi" sẽ được gán tự động khi middleware i18n bật.
 */
export default function RootPage(): never {
  redirect("/trang-chu");
}
