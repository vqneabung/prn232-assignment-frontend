import { create } from "zustand";

export const authStore = create((set) => ({
  email: "",
  setEmail: (email: string) => set({ email }),
}));

