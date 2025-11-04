import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Header } from "./_components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-1 flex-col">
        <section className="from-background to-muted flex min-h-[600px] w-full items-center justify-center bg-linear-to-b py-20 md:min-h-[700px] md:py-32 lg:min-h-[800px] lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Smart Assignment
                  <br />
                  <span className="from-primary bg-linear-to-r to-blue-600 bg-clip-text text-transparent">
                    Grading System
                  </span>
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg lg:text-xl">
                  Giải pháp toàn diện cho việc chấm điểm bài tập. Tự động hóa quy trình chấm bài, tiết kiệm thời gian và
                  nâng cao hiệu quả.
                </p>
              </div>
              <div className="flex w-full flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                <Link href="/auth/login">
                  <Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto">
                    Bắt đầu ngay
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-12 w-full px-8 text-base sm:w-auto">
                    Tìm hiểu thêm
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">
                ✓ Miễn phí • Không cần thẻ tín dụng • Bắt đầu trong vòng 5 phút
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="bg-background w-full border-t py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-16 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Tính năng chính</h2>
              <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
                Những tính năng giúp bạn chấm bài hiệu quả hơn
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  title: "Chấm bài tự động",
                  description: "Tự động chấm các bài trắc nghiệm với độ chính xác cao",
                },
                {
                  title: "Phân loại bài tập",
                  description: "Phân loại và quản lý các loại bài tập theo môn học",
                },
                {
                  title: "Báo cáo chi tiết",
                  description: "Xem báo cáo chi tiết kết quả chấm bài của học sinh",
                },
                {
                  title: "Quản lý lớp học",
                  description: "Quản lý lớp học, học sinh, giáo viên trong một nền tảng",
                },
                {
                  title: "Giao bài tập",
                  description: "Giao bài tập và theo dõi tiến độ hoàn thành",
                },
                {
                  title: "Nhận xét tự động",
                  description: "Tạo nhận xét tự động dựa trên kết quả chấm",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-card hover:border-primary/50 space-y-3 rounded-xl border p-6 transition-all hover:shadow-xl"
                >
                  <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted w-full border-t py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-8 text-center md:grid-cols-3 md:gap-12">
              <div className="space-y-3 md:space-y-4">
                <div className="text-primary text-5xl font-bold md:text-6xl lg:text-7xl">10K+</div>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Giáo viên đang sử dụng</p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="text-primary text-5xl font-bold md:text-6xl lg:text-7xl">1M+</div>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Bài tập đã chấm</p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="text-primary text-5xl font-bold md:text-6xl lg:text-7xl">95%</div>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Độ hài lòng của người dùng</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background w-full border-t py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-6 text-center md:space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Sẵn sàng bắt đầu?</h2>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
                  Tham gia hàng ngàn giáo viên tin tưởng nền tảng của chúng tôi
                </p>
              </div>
              <Link href="/auth/login">
                <Button size="lg" className="h-12 px-8 text-base md:h-14 md:px-12 md:text-lg">
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted border-t py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h4 className="font-semibold">ScoreHub</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">Nền tảng chấm bài thông minh</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wide uppercase">Sản phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Giá cả
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wide uppercase">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wide uppercase">Pháp lý</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Điều khoản
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Riêng tư
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-muted-foreground flex flex-col items-center justify-between gap-6 border-t pt-8 text-xs sm:text-sm md:flex-row">
            <p>&copy; 2025 ScoreHub. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
