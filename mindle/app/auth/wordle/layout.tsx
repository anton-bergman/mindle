"use client";
import { WordleContextProvider } from "../../context/WordleOrdleContext";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <WordleContextProvider gameType="wordle">
        {children}
      </WordleContextProvider>
    </>
  );
}
