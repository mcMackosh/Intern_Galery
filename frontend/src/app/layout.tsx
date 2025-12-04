import type { Metadata } from "next";
import '../shared/style/globals.css'
import { MainProvider } from "../providers/mainProvider";
import { Toaster } from "sonner";
import { Header } from "@/feature/layouts/Header/Header";

export const metadata: Metadata = {
  title: 'Galery'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <MainProvider>
          <Header />

          <div className="pt-16 min-h-screen">
            {children}
          </div>

          <Toaster position="top-right" richColors />
        </MainProvider>
      </body>
    </html>
  );
}
