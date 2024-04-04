"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, loading, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("./sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("./sign-in");
    }
  }, [loading, router, user]);

  return (
    // <ProtectedRoute>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.displayName}!</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <p className="text-xl mb-4">Here&apos;s your profile information:</p>
        <ul className="text-left">
          <li className="mb-2">
            <strong>Email:</strong> {user?.email}
          </li>
          <li className="mb-2">
            <strong>Username:</strong> {user?.displayName}
          </li>
          {/* Add more profile information here */}
        </ul>
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 mt-8 rounded-md"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
    // </ProtectedRoute>
  );
}
