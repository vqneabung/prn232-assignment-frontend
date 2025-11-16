"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authStore } from "@/stores/auth/authStore";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const authData = authStore();

  const isLoggedIn = !!authData.userName;

  const handleLoginClick = () => {
    console.log("Auth Data:", authData);
    if (!isLoggedIn) {
      router.push("/auth/login");
    } else {
      redirectToRoleHome(authData.role || "");
    }
  };

  const protectedRoutes = {
    admin: ["/admin"],
    manager: ["/manager"],
    moderator: ["/moderator"],
    examiner: ["/examiner"],
  };

  const redirectToRoleHome = (role: string) => {
    const routes = protectedRoutes[role.toLowerCase() as keyof typeof protectedRoutes];
    if (routes.length > 0) {
      router.push(routes[0]);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            ✓
          </div>
          <span className="hidden sm:inline">ScoreHub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:gap-8 lg:flex">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#testimonials"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Testimonials
          </Link>
        </nav>

        <Button variant="default" size="sm" className="text-xs sm:text-sm" onClick={handleLoginClick}>
          Login
        </Button>
      </div>
    </header>
  );
}
