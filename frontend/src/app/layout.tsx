import type { Metadata } from "next";
import '../shared/style/globals.css'
import { MainProvider } from "../providers/mainProvider";
import { Toaster } from "sonner";
import { Header } from "@/feature/layouts/Header/Header";
import Footer from "@/feature/layouts/Footer/Footer";

export const metadata: Metadata = {
  title: 'Gallery'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <MainProvider>
          <Header />
          <Toaster position="top-right" richColors />
          <main className="flex-grow pt-16 box-border">
            {children}
          </main>
          <Footer />
        </MainProvider>
      </body>
    </html>
  );
}
