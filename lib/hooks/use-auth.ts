"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useSafePathname } from "@/lib/hooks/useSafePathname";

export function useAuth() {
  const router = useRouter();
  const pathname = useSafePathname();
  const  { user , loading : isLoading } = useAuthStore();

  useEffect(() => {
    if (!pathname) return;
  }, [user, pathname, router]);

  return {
    user,
    isAuthenticated: !!user,
    isAuthLoading : isLoading
  };
}
