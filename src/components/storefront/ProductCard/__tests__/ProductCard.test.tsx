import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
} from "../ProductCard";
import type { ProductCardBaseProps } from "../ProductCard.types";

const baseProduct: ProductCardBaseProps = {
  imageUrl: "https://example.com/shirt.jpg",
  imageAlt: "Áo thun cotton",
  title: "Áo thun unisex cotton UTC Basic thoáng khí dệt kim cao cấp",
  price: 159000,
  rating: 4.9,
  soldCount: 2400,
  location: "TP. Hồ Chí Minh",
};

describe("ProductCard – base structure (Modern Clean, 220px)", () => {
  it("A: hiển thị thẻ thường — ảnh, tên, giá, rating, location", () => {
    render(<ProductCardDefault {...baseProduct} />);
    expect(
      screen.getByText(/Áo thun unisex cotton UTC Basic/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/159\.000₫/)).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText(/Đã bán 2,4k/)).toBeInTheDocument();
    expect(screen.getByText(/TP\. Hồ Chí Minh/)).toBeInTheDocument();
  });

  it("A: dùng wrapper w-[220px] rounded-2xl bg-card border border-line", () => {
    const { container } = render(<ProductCardDefault {...baseProduct} />);
    const card = container.querySelector(".w-\\[220px\\]") as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.className).toMatch(/rounded-2xl/);
    expect(card.className).toMatch(/bg-card/);
    expect(card.className).toMatch(/border-line/);
  });

  it("A: title clamp 2 dòng (40px) — Tailwind line-clamp-2 + height 40px", () => {
    render(<ProductCardDefault {...baseProduct} />);
    const title = screen.getByRole("heading", { level: 3 });
    expect(title.className).toMatch(/line-clamp-2/);
  });

  it("A: body padding 14px (p-3.5)", () => {
    const { container } = render(<ProductCardDefault {...baseProduct} />);
    const body = container.querySelector(".p-3\\.5") as HTMLElement;
    expect(body).toBeTruthy();
  });
});

describe("ProductCard – pricing variants", () => {
  it("B: Discount — hiện badge -25% góc trên phải ảnh, giá đỏ, giá gốc gạch ngang", () => {
    render(
      <ProductCardDiscount
        {...baseProduct}
        price={179000}
        originalPrice={239000}
        discountPercent={25}
        title="Tai nghe Bluetooth chống ồn"
      />,
    );
    expect(screen.getByText("-25%")).toBeInTheDocument();
    expect(screen.getByText(/179\.000₫/)).toBeInTheDocument();
    expect(screen.getByText(/239\.000₫/)).toBeInTheDocument();
  });

  it("C1: Voucher — overlay pill 'Giảm 10K' góc dưới trái ảnh (bg-brand)", () => {
    const { container } = render(
      <ProductCardVoucher
        {...baseProduct}
        voucherLabel="Giảm 10K"
        price={450000}
        soldCount={960}
        title="Bàn phím cơ"
      />,
    );
    expect(screen.getByText("Giảm 10K")).toBeInTheDocument();
    const tag = container.querySelector(".bg-brand") as HTMLElement;
    expect(tag).toBeTruthy();
  });

  it("C2: Freeship — overlay pill 'Freeship' góc dưới trái (bg-seller)", () => {
    const { container } = render(
      <ProductCardFreeship
        {...baseProduct}
        price={189000}
        soldCount={3100}
        location="TP. Hồ Chí Minh"
        title="Bình giữ nhiệt"
      />,
    );
    expect(screen.getByText("Freeship")).toBeInTheDocument();
    const tag = container.querySelector(".bg-seller") as HTMLElement;
    expect(tag).toBeTruthy();
  });

  it("C3: Sale + Voucher — badge -25% TRÊN PHẢI + pill 'Giảm 10K' DƯỚI TRÁI", () => {
    render(
      <ProductCardSaleVoucher
        {...baseProduct}
        price={159000}
        originalPrice={212000}
        discountPercent={25}
        voucherLabel="Giảm 10K"
        soldCount={5200}
        title="Đèn bàn"
      />,
    );
    expect(screen.getByText("-25%")).toBeInTheDocument();
    expect(screen.getByText("Giảm 10K")).toBeInTheDocument();
  });
});

describe("ProductCard – Flash Sale variants", () => {
  it("D: Flash Sale — badge ⚡FLASH SALE trái + -45% phải, progress bar 60%, button 'Mua ngay'", () => {
    render(
      <ProductCardFlashSale
        {...baseProduct}
        price={89000}
        originalPrice={160000}
        discountPercent={45}
        soldPercent={60}
        soldCount={72}
        stockLeft={48}
        purchaseLimit={2}
        title="Chuột công thái học"
      />,
    );
    expect(screen.getByText(/FLASH SALE/)).toBeInTheDocument();
    expect(screen.getByText("-45%")).toBeInTheDocument();
    expect(screen.getByText(/ĐÃ BÁN 72/)).toBeInTheDocument();
    expect(screen.getByText(/Còn 48/)).toBeInTheDocument();
    expect(screen.getByText(/Giới hạn 2\/khách/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Mua ngay/i }),
    ).toBeInTheDocument();
  });

  it("E: Almost sold-out — progress 92%, label '🔥 SẮP CHÁY HÀNG', 'Chỉ còn 3 suất'", () => {
    render(
      <ProductCardAlmostSoldOut
        {...baseProduct}
        price={89000}
        originalPrice={160000}
        discountPercent={45}
        soldPercent={92}
        stockLeft={3}
        purchaseLimit={1}
        title="Cối xay cà phê"
      />,
    );
    expect(screen.getByText(/SẮP CHÁY HÀNG/)).toBeInTheDocument();
    expect(screen.getByText(/Chỉ còn 3 suất/)).toBeInTheDocument();
    expect(screen.getByText(/Giới hạn 1\/khách/)).toBeInTheDocument();
  });

  it("F: Sold-out — overlay 'Hết hàng' blur, button disabled 'Đã hết'", () => {
    render(
      <ProductCardSoldOut
        {...baseProduct}
        price={89000}
        originalPrice={160000}
        discountPercent={45}
        purchaseLimit={2}
        title="Đồng hồ để bàn"
      />,
    );
    expect(screen.getByText("Hết hàng")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: /Đã hết/i });
    expect(btn).toBeDisabled();
  });

  it("G: Upcoming — không có flash sale pill, có 'Bắt đầu lúc HH:MM' + button 'Nhắc tôi'", () => {
    render(
      <ProductCardUpcoming
        {...baseProduct}
        price={89000}
        originalPrice={160000}
        discountPercent={45}
        startsAt="15:00"
        title="Loa Bluetooth"
      />,
    );
    expect(screen.getByText(/Bắt đầu lúc/i)).toBeInTheDocument();
    expect(screen.getByText("15:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Nhắc tôi/i }),
    ).toBeInTheDocument();
  });
});

describe("ProductCard – Interactive states", () => {
  it("H: Skeleton — animate-pulse, không có text nội dung", () => {
    const { container } = render(<ProductCardSkeleton />);
    const pulses = container.querySelectorAll(".animate-pulse");
    expect(pulses.length).toBeGreaterThan(0);
    expect(screen.queryByText(/159\.000₫/)).not.toBeInTheDocument();
  });

  it("Hover: có heart wishlist + 'Thêm vào giỏ' slide-up", () => {
    render(<ProductCardHover {...baseProduct} />);
    expect(
      screen.getByRole("button", { name: /yêu thích/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Thêm vào giỏ/i)).toBeInTheDocument();
  });

  it("Focus: có outline ring brand-300 (focus state)", () => {
    const { container } = render(<ProductCardFocus {...baseProduct} />);
    // Card có border-brand, border-2, và tabIndex={0}
    const card = container.querySelector("[tabindex='0']") as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.className).toMatch(/border-brand/);
    expect(card.className).toMatch(/border-2/);
  });
});

describe("ProductCard – Mobile adaptations", () => {
  it("Mobile 170px — wrapper w-[170px], KHÔNG có dòng location", () => {
    const { container } = render(
      <ProductCardMobile
        imageUrl="x.jpg"
        title="Áo thun"
        price={159000}
        rating={4.8}
        soldCount={850}
      />,
    );
    const card = container.querySelector(".w-\\[170px\\]") as HTMLElement;
    expect(card).toBeTruthy();
    expect(screen.queryByText(/Hồ Chí Minh/)).not.toBeInTheDocument();
  });

  it("Mobile horizontal 340px — ảnh vuông trái, info phải, có CTA 'Mua ngay'", () => {
    render(
      <ProductCardMobileHorizontal
        imageUrl="x.jpg"
        title="Chuột công thái học Silent Click"
        price={89000}
        originalPrice={160000}
        soldPercent={80}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Mua ngay/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Đã bán 80%/)).toBeInTheDocument();
  });

  it("Mini 160px — ảnh vuông 160px, truncate 1 dòng title, giá", () => {
    const { container } = render(
      <ProductCardMini
        imageUrl="x.jpg"
        title="Bình giữ nhiệt Inox 316 800ml"
        price={189000}
      />,
    );
    const img = container.querySelector(".h-\\[160px\\]") as HTMLElement;
    expect(img).toBeTruthy();
    expect(screen.getByText("Bình giữ nhiệt Inox 316 800ml")).toBeInTheDocument();
  });
});

describe("ProductCard – composability", () => {
  it("ProductCard (root) cho phép truyền variant rõ ràng", () => {
    render(<ProductCard variant="discount" imageUrl="x" title="A" price={179000} originalPrice={239000} discountPercent={25} />);
    expect(screen.getByText("-25%")).toBeInTheDocument();
  });
});
