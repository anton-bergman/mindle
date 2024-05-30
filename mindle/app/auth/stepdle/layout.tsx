"use client";
import { StepdleContextProvider } from "../../context/StepdleContext";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StepdleContextProvider>{children}</StepdleContextProvider>
    </>
  );
}
