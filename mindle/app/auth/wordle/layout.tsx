"use client";
import { WordleContextProvider } from "./WordleContext";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <WordleContextProvider>{children}</WordleContextProvider>
    </>
  );
}
