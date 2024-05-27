"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, userLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userLoaded === false) {
      router.push("../");
    }
  }, [router, userLoaded]);

  return loading ? (
    <div className="flex items-center justify-center min-h-screen bg-page_background">
      <Spinner size="lg" />
    </div>
  ) : (
    <>{user && children}</>
  );
}
