"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !user) {
      router.replace("/auth");
    }
  }, [user, _hasHydrated, router]);

  // Don't render anything until Zustand has rehydrated from localStorage.
  // Without this guard, a logged-in user who refreshes sees a flash-redirect
  // to /auth before the persisted user state is restored.
  if (!_hasHydrated) return null;
  if (!user) return null;

  return <>{children}</>;
}
