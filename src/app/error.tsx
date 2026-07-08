"use client";
// 전역 에러 바운더리 — DB 일시 장애·액션 예외 시 재시도 가능한 안내 화면
import Link from "next/link";
import { btnPrimaryCls, btnSecondaryCls } from "@/lib/ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto mt-24 max-w-sm text-center">
      <h1 className="text-xl font-semibold">문제가 발생했습니다</h1>
      <p className="mt-2 text-sm text-zinc-500">
        일시적인 오류일 수 있습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <button type="button" onClick={reset} className={btnPrimaryCls}>
          다시 시도
        </button>
        <Link href="/" className={btnSecondaryCls}>
          대시보드로
        </Link>
      </div>
    </div>
  );
}
