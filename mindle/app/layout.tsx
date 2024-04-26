import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { AuthContextProvider } from "@/app/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mindle",
  description: "Daily word games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <main className="dark text-foreground bg-background">
            <AuthContextProvider>{children}</AuthContextProvider>
          </main>
        </NextUIProvider>
      </body>
    </html>
  );
}
