"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

export default function Auth() {
  const { userLoaded, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userLoaded) {
      router.push("auth/profile");
    }
  }, [router, userLoaded]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary_background">
      <Spinner size="lg" />
    </div>
  );
}
