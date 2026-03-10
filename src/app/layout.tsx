import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skar Pipeline | LOUD",
  description: "Gestão de Challenges do Skar Quantum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full overflow-hidden">
      <body className={`${inter.className} antialiased bg-black h-full overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
