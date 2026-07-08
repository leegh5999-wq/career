// 전체 페이지 공통 레이아웃 — 상단 네비게이션과 메타데이터를 정의
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "경력 관리",
  description: "전기·통신 설계 엔지니어를 위한 프로젝트 경력·성과 기록",
};

const navItems = [
  { href: "/", label: "대시보드" },
  { href: "/projects", label: "프로젝트" },
  { href: "/certifications", label: "자격·교육" },
  { href: "/export", label: "출력" },
  { href: "/settings", label: "설정" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white print:hidden">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
            <Link href="/" className="font-semibold">
              경력 관리
            </Link>
            <div className="flex gap-4 text-sm text-zinc-600">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
