import { create } from "zustand";

import { Auth } from "@/types/type";

export const authStore = create<Auth>()((set) => ({
  email: "",
  setEmail: (email: string) => set({ email }),
}));
