import type { Metadata } from "next";
import {
  ProductCard,
  ProductCardDefault,
  ProductCardDiscount,
  ProductCardVoucher,
  ProductCardFreeship,
  ProductCardSaleVoucher,
  ProductCardFlashSale,
  ProductCardAlmostSoldOut,
  ProductCardSoldOut,
  ProductCardUpcoming,
  ProductCardSkeleton,
  ProductCardHover,
  ProductCardFocus,
  ProductCardMobile,
  ProductCardMobileHorizontal,
  ProductCardMini,
} from "@/components/storefront/ProductCard";

/**
 * /products-demo – Design Review page
 *
 * Chỉ có trong branch feature/storefront-product-card-modern-clean để review trực quan
 * 14 biến thể ProductCard (Bộ Component Thẻ Sản Phẩm - Biến thể 1: Modern Clean).
 * KHÔNG push lên dev. Khi review xong sẽ xoá page này.
 */

export const metadata: Metadata = {
  title: "ProductCard Design Review – Vibe Mart",
  description: "Review tất cả biến thể ProductCard Modern Clean",
  robots: { index: false, follow: false },
};

const IMG_TSHIRT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDcWC9TPjvI32EkSEPY2YGhpKgBjX5eIEsAkQI3mhKA9XwtVOUjE5m8Zrzo27WyOHDR3YnBWPeV7pbPo-uIt-r2ZXIJcMploNraemxhEChQwRK1bsyTaaJ9xtCQNyBOu7izvFnFdmPY-Aoivq1IcJbaFkWCRa5pOSgccC8kPZI2dwawFTxFV_Y0l4A1k1IsNs3m5j5bfMQB1mRrdRnMDz7eT-oka7RwclSYrzcrk2sG3-euAutkw7aBxQ";
const IMG_HEADPHONE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBh6mq3Hh7yDJC5ySz9NEnHeO7w6wqxD1d6VY7RLSA3FQ0toO7ZGp4gyQTCLZLbV5blBoTnXGk7Af53DMBAvuMFt9RUJWqphufwpBpdDvrLq5ptDq6LgpLSkm8hsX42Ukwa_LapqsbBmWc_VBZw82bEMjaZhFZzSJq5paT93AzP-LxyMgxArhYwHDls9jxDJ9mdlYzOmwfQiWlx_a43o2D2i4tMZQUfPIrq81CfM_jnleydH2vgVDwwIA";
const IMG_KEYBOARD =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCEskrnq5COEbjrzxgcBQe2K6TSojsMxvLduopVevBu73y0I7hVBbgy_vm3txd6_c6oSof9HVHhrQaM-b2xsDEyU_f97QQzXEPNvcBFx0xckEhAhei7Fks-V6e01vQKFeB_yh10c7jfXEpckfYlH3ltMg-WDmePGy42_19WbG5cxtb6Rwhbv1OUznA_eV5jO8Wg0CmtYXIVGGqy8luRzA-vL01W_KnH-ubWqgcJLf4qAlqrtI5bCK3KHg";
const IMG_TUMBLER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBhOVO-MQvfq9ZSgA48Tud_LSm1UExAqBzzWpmgH2BTOLzbzU91J9WUYY2dotuzlyUqbs5W9MiPUxjNFHvp8pGmuGjhqH5jZIpMh_to42tA9yF2fBUWmMi28gZvB12R4PQSHTq6Ob8t4OOYpRiER4ruqN8tMS3s1EB1DytmL6DIfR9KEpEXJ_bZNu3ZyL9wOqTfIWSUIT_dNa6-6T8l1QrY8grO4_Mjz465_4e04jmOZiZnGF4MA0zcoQ";
const IMG_LAMP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCiJMb-Mz3VbQtEjGZY3pdBmuuuTBiuxoKUA9WplfKrlVIBb6zH0H-Fcw_W6FJv3ANpU5LwVLjsmrqPT7D7B_CS6rNwFl5Wvkw3TmidPIuSZ1QvkXd0Im0Z8PxJGX29zx3uyOCQ8LaLAM2F9h9qj-cepDlE1xs9I9MLQgORDTWf46VZZSV6D3nXjtHPX4JeIaQnoWWEskgiCvjTHRUds3zZkg51Ue39ZZyWmnRmErLF9ijz6n-MWrOcew";
const IMG_MOUSE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAh_lEDbn4GtYstDLmEQ9c-uNeq7coVOCWil8WJFQ75jUNwyS6xDtWE3qNTfr1iUOI3aK9THhInaGiiPO-gwkFkdKQRzgJHJEy972g5FSShV-EyeGwj5MiAQBCRoxOsM2jHfFvt-kO19Ld0xK--xXGi-Qb3yGorcrir6YV5HymebM8C2IG6DzSTzhHsi6cSfX_rvb_QZQ6gPYmHlst9NkIQjy5APcWwJSIEfn-OrDog8DHcTEsTk43Smw";
const IMG_GRINDER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBVdMV8CrZOCsY18ohtXwaLOvqYdJfzCIM0SU3Z6PTw7OORbT3ZreZIP2__VYugHIk9LT9vWTyFXHx07T7V7UzauMx7gT9oDI0KlTyoLusCkGdCXvZwJyF4U6g4GdrMCnAOBbh-L2HWe3pGgqP46S3ZkFnSw9T_T63zTJIBzSL_y2j1uR_t3jz66J1-V6yeCK7c8xuE8ztE6DxkWNIEdMPU3TrJfPg3sxO5Y78AJ4v0bQSbUL2q7DCXfA";
const IMG_CLOCK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuABGUkFl7Fc7RiZomowiTC4pQnJszuLrbQpsA2IbsNfvO5bj27jGNBoB1mXLKnSBuMqL9CfmMoE4GrNcW6fScMhwtALyIJuWje6gbsQVuGqezsbv1K2WHy__7P1EKcl_9NbKEIq-Tv-6gtEghtLoERNJilf5oNRGO63D6aBXmrCxKrs7oDZton2AQ9VVAQfqDdidH6uAk2HSTbHTpuscBsBfst36SKhvD0mryyNkwMzqXyPLDHbrMNkjg";
const IMG_SPEAKER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDrqUNhoRj6peZ-UoiXe9WgrNE11z_XqoKTM5mtzRRQXqfq9AgbOjIXlZAqE4KhpUGI3atndjS0BbdaN2QoS7i6ywxUbwoCGOpgSjG-unKhYv_15HDd9xBaZcEFunosQm-ogqPbfIxx7bLhwt1HUhHkh0_cwD9I4kvfSGv96T7-5xOO49MCRNAg6eiYGKMbHYryuDc4IHlbqBzvfP4WsQVfRC5kT-kIj9X_FhkmfaE_MNs_msOoq890Bg";

/* ----- Section helpers ----- */
function Section({
  number,
  title,
  badge,
  children,
}: {
  number: string;
  title: string;
  badge?: { label: string; tone: "sky" | "red" | "slate" | "indigo" | "emerald" };
  children: React.ReactNode;
}) {
  const toneClass = {
    sky: "from-[#0284C7] to-[#0EA5E9] shadow-sky-500/25",
    red: "from-rose-500 to-red-500 shadow-red-500/25",
    slate: "bg-slate-800 shadow-slate-800/25",
    indigo: "from-indigo-600 to-indigo-500 shadow-indigo-500/25",
    emerald: "from-emerald-600 to-teal-500 shadow-emerald-500/25",
  }[badge?.tone ?? "sky"];
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-xl text-[13px] font-bold text-white bg-gradient-to-tr shadow-sm ${toneClass}`}
          >
            {number}
          </span>
          <div>
            <h2 className="text-[18px] font-bold text-ink">{title}</h2>
          </div>
        </div>
        {badge && (
          <span
            className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
              badge.tone === "red"
                ? "bg-sale-soft text-sale border-sale/30"
                : badge.tone === "emerald"
                ? "bg-seller-soft text-seller border-seller/30"
                : badge.tone === "indigo"
                ? "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                : "bg-brand-soft text-brand border-brand/30"
            }`}
          >
            {badge.label}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function VariantLabel({ tone, children }: { tone: VariantTone; children: React.ReactNode }) {
  const map: Record<VariantTone, string> = {
    slate: "bg-slate-100 text-slate-700 border-slate-200/70",
    red: "bg-sale-soft text-sale border-sale/30",
    sky: "bg-brand-soft text-brand border-brand/30",
    emerald: "bg-seller-soft text-seller border-seller/30",
    amber: "bg-amber-50 text-amber-800 border-amber-200/60",
    orange: "bg-orange-50 text-orange-700 border-orange-200/60",
    violet: "bg-violet-50 text-violet-700 border-violet-200/60",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  };
  return (
    <div
      className={`mb-2 px-3 py-0.5 rounded-full text-[11px] font-semibold border w-fit ${map[tone]}`}
    >
      {children}
    </div>
  );
}

type VariantTone =
  | "slate"
  | "red"
  | "sky"
  | "emerald"
  | "amber"
  | "orange"
  | "violet"
  | "indigo";

function CardCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center w-full max-w-[220px]">{children}</div>
  );
}

export default function ProductsDemoPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Notice banner */}
      <div className="rounded-2xl border-2 border-dashed border-warning/60 bg-warning/5 p-4 text-sm text-ink">
        <strong className="text-warning">⚠ Design Review page</strong> – Trang này chỉ có
        trong branch <code className="rounded bg-warning/10 px-1.5 py-0.5">feature/storefront-product-card-modern-clean</code>{" "}
        để review trực quan 14 biến thể ProductCard khớp Stitch. Sẽ xoá khi review xong.
      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-2 border-b border-line/80 pb-6">
        <span className="w-fit px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-brand-soft text-brand border border-brand/30">
          Component Spec
        </span>
        <h1 className="text-[28px] md:text-[34px] font-extrabold tracking-tight text-ink leading-tight">
          Bộ Component Thẻ Sản Phẩm <span className="text-brand">(ProductCard)</span>
        </h1>
        <p className="text-[14px] max-w-3xl leading-relaxed text-ink-2">
          14 biến thể Modern Clean &amp; Soft Glass/Border. Tối ưu bo góc 16px (rounded-2xl),
          viền mảnh 1px thanh lịch, bóng mờ êm dịu, nhãn pill-shaped tinh tế, khung title
          cố định 40px (line-clamp-2) chống giật layout.
        </p>
      </div>

      {/* ===================== SECTION 1: STOREFRONT ===================== */}
      <Section
        number="01"
        title="Storefront Chuẩn & Đối Soát Đáy Thẳng Hàng (W: 220px)"
        badge={{ label: "Quy chuẩn: p-3.5 · rounded-2xl · border-line/80", tone: "sky" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 items-start justify-items-center sm:justify-items-stretch">
          <CardCell>
            <VariantLabel tone="slate">Biến thể A: Thường</VariantLabel>
            <ProductCardDefault
              imageUrl={IMG_TSHIRT}
              imageAlt="Áo thun cotton"
              title="Áo thun unisex cotton UTC Basic thoáng khí dệt kim cao cấp"
              price={159000}
              rating={4.9}
              soldCount={2400}
              location="TP. Hồ Chí Minh"
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="red">Biến thể B: Giảm giá</VariantLabel>
            <ProductCardDiscount
              imageUrl={IMG_HEADPHONE}
              imageAlt="Tai nghe Bluetooth"
              title="Tai nghe Bluetooth chống ồn TechZone Air Pro thế hệ mới"
              price={179000}
              originalPrice={239000}
              discountPercent={25}
              rating={4.8}
              soldCount={1800}
              location="Hà Nội"
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="sky">Biến thể C1: Có Voucher</VariantLabel>
            <ProductCardVoucher
              imageUrl={IMG_KEYBOARD}
              imageAlt="Bàn phím cơ"
              title="Bàn phím cơ không dây Vibe Compact Pro RGB Switch quang học"
              price={450000}
              voucherLabel="Giảm 10K"
              rating={4.9}
              soldCount={960}
              location="Đà Nẵng"
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="emerald">Biến thể C2: Freeship</VariantLabel>
            <ProductCardFreeship
              imageUrl={IMG_TUMBLER}
              imageAlt="Bình giữ nhiệt"
              title="Bình giữ nhiệt Inox 316 dung tích 800ml kèm ống hút tiện dụng"
              price={189000}
              rating={4.7}
              soldCount={3100}
              location="TP. Hồ Chí Minh"
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="amber">Biến thể C3: Sale + Voucher</VariantLabel>
            <ProductCardSaleVoucher
              imageUrl={IMG_LAMP}
              imageAlt="Đèn bàn thông minh"
              title="Đèn bàn thông minh LED chống cận kiêm sạc nhanh không dây Qi"
              price={159000}
              originalPrice={212000}
              discountPercent={25}
              voucherLabel="Giảm 10K"
              rating={4.9}
              soldCount={5200}
              location="TP. Hồ Chí Minh"
            />
          </CardCell>
        </div>
      </Section>

      {/* ===================== SECTION 2: FLASH SALE ===================== */}
      <Section
        number="02"
        title="Biến Thể Flash Sale Chuyên Dụng (D, E, F, G)"
        badge={{ label: "Flash Sale Theme: #E11D48", tone: "red" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-start justify-items-center sm:justify-items-stretch">
          <CardCell>
            <VariantLabel tone="red">Biến thể D: Đang Flash Sale</VariantLabel>
            <ProductCardFlashSale
              imageUrl={IMG_MOUSE}
              imageAlt="Chuột công thái học"
              title="Chuột công thái học không dây Silent Click quang học đa kênh"
              price={89000}
              originalPrice={160000}
              discountPercent={45}
              soldPercent={60}
              soldCount={72}
              stockLeft={48}
              purchaseLimit={2}
              onBuy={() => alert("Mua ngay chuột công thái học")}
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="orange">Biến thể E: Sắp cháy hàng</VariantLabel>
            <ProductCardAlmostSoldOut
              imageUrl={IMG_GRINDER}
              imageAlt="Cối xay cà phê"
              title="Cối xay cà phê tay cầm thép không gỉ CNC lưỡi nón siêu mịn"
              price={89000}
              originalPrice={160000}
              discountPercent={45}
              soldPercent={92}
              soldCount={138}
              stockLeft={3}
              purchaseLimit={1}
              onBuy={() => alert("Mua ngay cối xay")}
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="slate">Biến thể F: Hết hàng</VariantLabel>
            <ProductCardSoldOut
              imageUrl={IMG_CLOCK}
              imageAlt="Đồng hồ để bàn"
              title="Đồng hồ để bàn phong cách cổ điển kim trôi không tiếng động"
              price={89000}
              originalPrice={160000}
              discountPercent={45}
              purchaseLimit={2}
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="violet">Biến thể G: Sắp diễn ra</VariantLabel>
            <ProductCardUpcoming
              imageUrl={IMG_SPEAKER}
              imageAlt="Loa Bluetooth"
              title="Loa Bluetooth di động kháng nước IPX7 Bass công suất lớn"
              price={89000}
              originalPrice={160000}
              discountPercent={45}
              startsAt="15:00"
              onRemind={() => alert("Đã đặt nhắc nhở")}
            />
          </CardCell>
        </div>
      </Section>

      {/* ===================== SECTION 3: STATES ===================== */}
      <Section
        number="03"
        title="Skeleton Loading & Trạng Thái Tương Tác"
        badge={{ label: "Micro-interactions: 200ms ease-out", tone: "slate" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start justify-items-center">
          <CardCell>
            <VariantLabel tone="slate">Biến thể H: Skeleton Loading</VariantLabel>
            <ProductCardSkeleton />
          </CardCell>
          <CardCell>
            <VariantLabel tone="sky">Trạng thái: Hover State</VariantLabel>
            <ProductCardHover
              imageUrl={IMG_TSHIRT}
              imageAlt="Áo thun cotton"
              title="Áo thun unisex cotton UTC Basic thoáng khí dệt kim cao cấp"
              price={159000}
              rating={4.9}
              soldCount={2400}
              location="TP. Hồ Chí Minh"
              onAddToCart={() => alert("Đã thêm vào giỏ")}
              onToggleWishlist={() => alert("Đã thêm vào yêu thích")}
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="indigo">Trạng thái: Keyboard Focus</VariantLabel>
            <ProductCardFocus
              imageUrl={IMG_TSHIRT}
              imageAlt="Áo thun cotton"
              title="Áo thun unisex cotton UTC Basic thoáng khí dệt kim cao cấp"
              price={159000}
              rating={4.9}
              soldCount={2400}
              location="TP. Hồ Chí Minh"
            />
          </CardCell>
        </div>
      </Section>

      {/* ===================== SECTION 4: MOBILE ===================== */}
      <Section
        number="04"
        title="Bản Mobile & Thẻ Mini (Mobile & Mini Adaptations)"
        badge={{ label: "Viewport Breakpoint: Mobile < 768px", tone: "emerald" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col items-center p-5 rounded-2xl bg-card border border-line/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <VariantLabel tone="slate">Mobile Grid Card (~170px)</VariantLabel>
            <ProductCardMobile
              imageUrl={IMG_TSHIRT}
              imageAlt="Áo thun cotton"
              title="Áo thun unisex cotton UTC Basic cao cấp"
              price={159000}
              rating={4.8}
              soldCount={850}
              voucherLabel="Giảm 10K"
            />
            <p className="text-[11.5px] mt-3.5 text-center text-ink-2">
              Tinh giản: bỏ dòng định vị tỉnh thành để tối ưu tỷ lệ cuộn trên màn hình hẹp.
            </p>
          </div>
          <div className="flex flex-col items-center p-5 rounded-2xl bg-card border border-line/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <VariantLabel tone="red">Thẻ Ngang Mobile Flash Sale (~340px)</VariantLabel>
            <ProductCardMobileHorizontal
              imageUrl={IMG_MOUSE}
              imageAlt="Chuột công thái học"
              title="Chuột công thái học Silent Click"
              price={89000}
              originalPrice={160000}
              soldPercent={80}
              onBuy={() => alert("Mua ngay")}
            />
            <p className="text-[11.5px] mt-3.5 text-center text-ink-2">
              Layout ngang dạng banner trượt ngang (Horizontal Carousel) trong phiên Flash Sale.
            </p>
          </div>
          <div className="flex flex-col items-center p-5 rounded-2xl bg-card border border-line/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <VariantLabel tone="slate">Thẻ Mini Shop/Cart (160px)</VariantLabel>
            <ProductCardMini
              imageUrl={IMG_TUMBLER}
              imageAlt="Bình giữ nhiệt"
              title="Bình giữ nhiệt Inox 316 800ml"
              price={189000}
            />
            <p className="text-[11.5px] mt-3.5 text-center text-ink-2">
              Sử dụng cho widget &quot;Sản phẩm khác của shop&quot; &amp; gợi ý mua kèm trong giỏ hàng.
            </p>
          </div>
        </div>
      </Section>

      {/* ===================== SECTION 5: ROOT DISPATCHER DEMO ===================== */}
      <Section
        number="05"
        title="Root Dispatcher (ProductCard variant=...)"
        badge={{ label: "API thống nhất qua 1 prop variant", tone: "sky" }}
      >
        <p className="text-[13px] text-ink-2 -mt-2">
          Cùng 1 component <code className="rounded bg-slate-100 px-1.5 py-0.5">ProductCard</code>,
          truyền prop <code className="rounded bg-slate-100 px-1.5 py-0.5">variant</code> để chọn
          biến thể. Hữu ích khi render từ data API (vd: CMS flag).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-start justify-items-center sm:justify-items-stretch">
          <CardCell>
            <VariantLabel tone="sky">root · variant=&quot;default&quot;</VariantLabel>
            <ProductCard
              variant="default"
              imageUrl={IMG_TSHIRT}
              imageAlt="Áo thun"
              title="Áo thun unisex cotton UTC Basic"
              price={159000}
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="red">root · variant=&quot;discount&quot;</VariantLabel>
            <ProductCard
              variant="discount"
              imageUrl={IMG_HEADPHONE}
              imageAlt="Tai nghe"
              title="Tai nghe Bluetooth TechZone Air Pro"
              price={179000}
              originalPrice={239000}
              discountPercent={25}
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="red">root · variant=&quot;flashSale&quot;</VariantLabel>
            <ProductCard
              variant="flashSale"
              imageUrl={IMG_MOUSE}
              imageAlt="Chuột"
              title="Chuột công thái học Silent Click"
              price={89000}
              originalPrice={160000}
              discountPercent={45}
              soldPercent={60}
              soldCount={72}
              stockLeft={48}
              purchaseLimit={2}
            />
          </CardCell>
          <CardCell>
            <VariantLabel tone="slate">root · variant=&quot;skeleton&quot;</VariantLabel>
            <ProductCard variant="skeleton" imageUrl="" title="" price={0} />
          </CardCell>
        </div>
      </Section>
    </div>
  );
}
