"use client";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { user, loading, signInWithGoogle, signOutWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("./profile");
    }
  }, [loading, router, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Mindle</h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mb-4"
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
}
