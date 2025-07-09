import { Outlet } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/common/Footer";

export function RootLayout() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex flex-col justify-between">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      </>
  );
}
