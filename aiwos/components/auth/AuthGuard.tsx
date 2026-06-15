"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if store has already hydrated, or subscribe to finish event
    setIsHydrated(useAuthStore.persist.hasHydrated());
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/auth");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) return null;

  return <>{children}</>;
}
