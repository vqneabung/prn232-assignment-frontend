import Link from "next/link";

import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <Lock className="text-primary mx-auto size-12" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">401 - Unauthorized</h1>
          <p className="text-muted-foreground">Bạn không có quyền truy cập trang này. Vui lòng đăng nhập lại.</p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/auth/login">
            <Button size="lg" className="w-full">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
