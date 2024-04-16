"use client";
import MenuBar from "@/app/components/MenuBar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtectedRoute>
        <MenuBar />
        {children}
      </ProtectedRoute>
    </>
  );
}
