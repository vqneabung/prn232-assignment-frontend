import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Auth } from "@/types/type";

// Helper to get cookie value
const getCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
  return "";
};

// Helper to clear cookie - ensure it's deleted across all domain variations
const clearCookie = (name: string) => {
  if (typeof document !== "undefined") {
    // Try clearing with different path and domain combinations
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; SameSite=Strict;`;
    // Also try with just domain without subdomain
    if (window.location.hostname.includes(".")) {
      const domain = window.location.hostname.split(".").slice(-2).join(".");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}; SameSite=Strict;`;
    }
  }
};

export const authStore = create<Auth>()(
  persist(
    (set) => ({
      userName: getCookie("userName"),
      userId: undefined,
      token: getCookie("token"),
      role: getCookie("role"),
      setUserName: (userName: string) => set({ userName }),
      setUserId: (userId: number) => set({ userId }),
      setToken: (token: string) => set({ token }),
      setRole: (role: string) => set({ role }),
      logout: () => {
        clearCookie("userName");
        clearCookie("token");
        clearCookie("role");
        clearCookie("userId");
        clearCookie("expiredAt");
        set({ userName: "", userId: undefined, token: "", role: "" });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
