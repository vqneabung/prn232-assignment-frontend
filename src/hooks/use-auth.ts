import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { authStore } from "@/stores/auth/authStore";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const userName = authStore((state) => state.userName);

  useEffect(() => {
    // Kiểm tra xem có userName trong auth store không
    if (!userName) {
      // Chuyển hướng sang unauthorized
      router.push("/unauthorized");
    }
    setIsLoading(false);
  }, [userName, router]);

  return {
    isLoading,
    isAuthenticated: !!userName,
    userName,
  };
}
