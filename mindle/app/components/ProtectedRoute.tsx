import { ReactNode, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      //sessionStorage.setItem("redirectUrl", router.pathname);
      //router.push("/auth/login");
    }
  }, [user, loading, router]);

  return loading ? <div>Loading...</div> : <>{user && children}</>;
}
