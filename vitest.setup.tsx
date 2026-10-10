import "@testing-library/jest-dom/vitest";

// next/image: render thẳng <img> thay vì wrapper phức tạp trong test
vi.mock("next/image", () => ({
  default: (props: { src: string; alt?: string }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt ?? ""} {...props} />,
}));

// matchMedia polyfill cho jsdom (không có sẵn)
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
