import type { Metadata } from "next";
import '../shared/style/globals.css'
import { MainProvider } from "../providers/mainProvider";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: 'Custom disk'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainProvider>
          {children}
           <Toaster position="top-right" richColors /> 
        </MainProvider>
      </body>
    </html>
  );
}
