import { Header, Footer } from "@/components/layout";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Đăng ký - FlashSale B2C",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Đăng ký để tham gia Flash Sale trong vài giây
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}