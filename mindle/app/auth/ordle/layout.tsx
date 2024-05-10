"use client";
import { WordleContextProvider } from "../../context/WordleOrdleContext";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <WordleContextProvider gameType="ordle">{children}</WordleContextProvider>
    </>
  );
}
