"use client";

import { useEffect } from "react";

import { restoreAuth } from "@/lib/auth-utils";
import { authStore } from "@/stores/auth/authStore";

export function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore auth từ localStorage khi app load
    restoreAuth();

    // Subscribe to auth store changes để update cookie
    const unsubscribe = authStore.subscribe((state) => {
      if (state.email) {
        // Set cookie khi có email
        document.cookie = `auth_email=${state.email}; path=/; SameSite=Lax`;
      } else {
        // Clear cookie khi logout
        document.cookie = "auth_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
