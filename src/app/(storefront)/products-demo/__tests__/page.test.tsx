import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductsDemoPage from "../page";

describe("ProductsDemoPage (review page)", () => {
  it("renders page title 'Bộ Component Thẻ Sản Phẩm'", () => {
    render(<ProductsDemoPage />);
    expect(
      screen.getByRole("heading", { name: /Bộ Component Thẻ Sản Phẩm/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders all 4 sections (Storefront, Flash Sale, States, Mobile)", () => {
    render(<ProductsDemoPage />);
    // Number badge + title ở 2 element khác nhau, dùng heading role
    expect(
      screen.getByRole("heading", { name: /Storefront Chuẩn/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Flash Sale Chuyên Dụng/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Skeleton Loading/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Bản Mobile/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it("renders all 14 ProductCard variants", () => {
    render(<ProductsDemoPage />);
    // 5 Storefront
    expect(screen.getByText(/Biến thể A: Thường/i)).toBeInTheDocument();
    expect(screen.getByText(/Biến thể B: Giảm giá/i)).toBeInTheDocument();
    expect(screen.getByText(/Biến thể C1: Có Voucher/i)).toBeInTheDocument();
    expect(screen.getByText(/Biến thể C2: Freeship/i)).toBeInTheDocument();
    expect(screen.getByText(/Biến thể C3: Sale \+ Voucher/i)).toBeInTheDocument();
    // 4 Flash Sale
    expect(screen.getByText(/Biến thể D: Đang Flash Sale/i)).toBeInTheDocument();
    expect(screen.getByText(/Biến thể E: Sắp cháy hàng/i)).toBeInTheDocument();
    expect(screen.getByText(/Biến thể F: Hết hàng/i)).toBeInTheDocument();
    expect(screen.getByText(/Biến thể G: Sắp diễn ra/i)).toBeInTheDocument();
    // States
    expect(screen.getByText(/Biến thể H: Skeleton Loading/i)).toBeInTheDocument();
    expect(screen.getByText(/Trạng thái: Hover State/i)).toBeInTheDocument();
    expect(screen.getByText(/Trạng thái: Keyboard Focus/i)).toBeInTheDocument();
    // Mobile
    expect(screen.getByText(/Mobile Grid Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Thẻ Ngang Mobile Flash Sale/i)).toBeInTheDocument();
    expect(screen.getByText(/Thẻ Mini Shop\/Cart/i)).toBeInTheDocument();
  });

  it("renders a notice banner that this is a design review page", () => {
    render(<ProductsDemoPage />);
    expect(
      screen.getByText(/Design Review/i),
    ).toBeInTheDocument();
  });
});
