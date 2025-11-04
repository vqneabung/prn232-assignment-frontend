import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { authStore } from "@/stores/auth/authStore";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const email = authStore((state) => state.email);

  useEffect(() => {
    // Kiểm tra xem có email trong auth store không
    if (!email) {
      // Chuyển hướng sang unauthorized
      router.push("/unauthorized");
    }
    setIsLoading(false);
  }, [email, router]);

  return {
    isLoading,
    isAuthenticated: !!email,
    email,
  };
}
