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

export const authStore = create<Auth>()(
  persist(
    (set) => ({
      userName: getCookie("userName"),
      token: getCookie("token"),
      role: getCookie("role"),
      setUserName: (userName: string) => set({ userName }),
      setToken: (token: string) => set({ token }),
      setRole: (role: string) => set({ role }),
      logout: () => set({ userName: "", token: "", role: "" }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
