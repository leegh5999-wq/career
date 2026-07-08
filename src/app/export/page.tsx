// 출력 허브 — 경력기술서·성과평가 자료로 가는 입구
import Link from "next/link";
import { todayKstInput } from "@/lib/format";
import { inputCls } from "@/lib/ui";

// 날짜 기본값이 빌드 시점에 동결되지 않도록 요청 시 렌더
export const dynamic = "force-dynamic";

export default function ExportPage() {
  const today = todayKstInput();
  const yearStart = `${today.slice(0, 4)}-01-01`;

  return (
    <div>
      <h1 className="text-2xl font-semibold">출력</h1>
      <p className="mt-1 text-sm text-zinc-500">
        기록한 경력·성과를 문서로 내보냅니다. 프로필 정보는{" "}
        <Link href="/settings" className="underline hover:text-zinc-900">
          설정
        </Link>
        에서 입력할 수 있습니다.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold">경력기술서</h2>
          <p className="mt-1 text-sm text-zinc-500">
            전체 프로젝트 경력을 이직·증빙용 문서로 정리합니다.
          </p>
          <div className="mt-4">
            <Link
              href="/export/career"
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              문서 보기
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold">성과평가 자료</h2>
          <p className="mt-1 text-sm text-zinc-500">
            기간 내 성과를 프로젝트별로 모아 평가 근거 자료를 만듭니다.
          </p>
          <form action="/export/review" className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="date"
              name="from"
              required
              aria-label="시작일"
              defaultValue={yearStart}
              className={inputCls}
            />
            <span className="text-sm text-zinc-400">~</span>
            <input
              type="date"
              name="to"
              required
              aria-label="종료일"
              defaultValue={today}
              className={inputCls}
            />
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              자료 보기
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
