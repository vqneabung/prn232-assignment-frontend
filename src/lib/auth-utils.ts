import { authStore } from "@/stores/auth/authStore";

/**
 * Set user email khi login thành công
 */
export function setAuth(email: string) {
  authStore.setState({ email });
  // Lưu vào localStorage (tạm thời, sau này dùng JWT token)
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_email", email);
  }
}

/**
 * Clear user email khi logout
 */
export function clearAuth() {
  authStore.setState({ email: "" });
  // Xóa khỏi localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_email");
  }
}

/**
 * Restore auth từ localStorage (gọi khi app initialize)
 */
export function restoreAuth() {
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("auth_email");
    if (email) {
      authStore.setState({ email });
    }
  }
}

/**
 * Check xem user có authenticated không
 */
export function isAuthenticated(): boolean {
  const email = authStore.getState().email;
  return !!email;
}

/**
 * Get current user email
 */
export function getCurrentEmail(): string {
  return authStore.getState().email;
}
