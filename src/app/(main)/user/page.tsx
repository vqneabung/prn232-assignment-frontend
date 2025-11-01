"use client"

import { authStore } from "@/stores/auth/authStore";

export default function Page() {
  const { email } = authStore();

  return <>Hello {email}</>;
}
