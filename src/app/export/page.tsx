// 출력 허브 — 경력기술서·성과평가 자료로 가는 입구
import Link from "next/link";
import { toDateInput } from "@/lib/format";

const inputCls =
  "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none";

export default function ExportPage() {
  const now = new Date();
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

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
              defaultValue={toDateInput(yearStart)}
              className={inputCls}
            />
            <span className="text-sm text-zinc-400">~</span>
            <input
              type="date"
              name="to"
              required
              defaultValue={toDateInput(now)}
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
