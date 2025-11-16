"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to grade list page
    router.replace("/examiner/grade/list");
  }, [router]);

  return <div>Redirecting...</div>;
}
