import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { authApi } from "@/lib/api/auth/auth";
import { authStore } from "@/stores/auth/authStore";

export function useLogout() {
  const router = useRouter();
  const { logout: clearAuthStore } = authStore();

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuthStore();
      toast.success("Logged out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return { logout };
}
