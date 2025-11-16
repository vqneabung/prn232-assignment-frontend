import { create } from "zustand";

import { Auth } from "@/types/type";

export const authStore = create<Auth>()((set) => ({
  userName: "",
  token: "",
  role: "",
  setUserName: (userName: string) => set({ userName }),
  setToken: (token: string) => set({ token }),
  setRole: (role: string) => set({ role }),
}));
