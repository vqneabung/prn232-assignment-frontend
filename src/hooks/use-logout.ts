import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { authApi } from "@/lib/api/auth/auth";
import { authStore } from "@/stores/auth/authStore";

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

export function useLogout() {
  const router = useRouter();
  const { logout: clearAuthStore } = authStore();

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuthStore();
      
      // Clear all auth cookies
      clearCookie("userName");
      clearCookie("token");
      clearCookie("role");
      clearCookie("userId");
      clearCookie("expiredAt");
      
      // Clear localStorage
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("auth-storage");
      }
      
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
