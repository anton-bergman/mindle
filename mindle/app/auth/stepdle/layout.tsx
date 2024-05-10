"use client";
import { StepdleContextProvider } from "./StepdleContext";

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
