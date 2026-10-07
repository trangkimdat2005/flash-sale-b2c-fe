import { Suspense } from "react";
import { Header, Footer } from "@/components/layout";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Đăng nhập - FlashSale B2C",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Chào mừng bạn quay lại với FlashSale B2C
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Suspense fallback={<p className="text-sm text-zinc-500">Đang tải...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}