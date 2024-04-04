"use client";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Leaderboard() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">Build Leaderboard here!</h1>
      </div>
    </ProtectedRoute>
  );
}
