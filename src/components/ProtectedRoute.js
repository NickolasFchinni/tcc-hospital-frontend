"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = (WrappedComponent) => {
  const HOC = (props) => {
    const { user, loading, authLoading } = useAuth(); 
    const router = useRouter();

    useEffect(() => {
      if (!loading && !authLoading) { 
        if (!user) {
          router.push("/");
        }
      }
    }, [user, loading, authLoading, router]); 

    if (loading || authLoading) { 
      return <div>Loading...</div>;
    }

    if (user) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  HOC.displayName = `ProtectedRoute(${getDisplayName(WrappedComponent)})`;

  return HOC;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default ProtectedRoute;
