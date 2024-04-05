"use client";
import MenuBar from "../components/MenuBar";
import ProtectedRoute from "../components/ProtectedRoute";

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
