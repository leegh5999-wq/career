// 성과평가 자료 — 기간 내 성과를 프로젝트별로 모은 인쇄용 문서
import Link from "next/link";
import {
  achievementLine,
  getReviewProjects,
  parseReviewRange,
} from "@/lib/export";
import { btnSecondaryCls } from "@/lib/ui";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

export default async function ReviewExportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const { fromStr, toStr, fromDate, toDate } = parseReviewRange(from, to);

  const projects = await getReviewProjects(fromDate, toDate);
  const total = projects.reduce((n, p) => n + p.achievements.length, 0);

  const mdHref = `/export/review/markdown?from=${fromStr}&to=${toStr}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Link href="/export" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← 출력
        </Link>
        <div className="flex gap-2">
          <a href={mdHref} className={btnSecondaryCls}>
            마크다운 다운로드
          </a>
          <PrintButton />
        </div>
      </div>

      <article className="rounded-lg border border-zinc-200 bg-white p-8 print:border-0 print:p-0">
        <h1 className="text-2xl font-bold">성과 정리</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {fromStr.replaceAll("-", ".")} ~ {toStr.replaceAll("-", ".")} · 총{" "}
          {total}건 / {projects.length}개 프로젝트
        </p>

        {projects.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-500">
            해당 기간에 기록된 성과가 없습니다.
          </p>
        ) : (
          projects.map((p) => (
            <section key={p.id} className="mt-6 break-inside-avoid">
              <h2 className="border-b border-zinc-200 pb-1 font-semibold">
                {p.name}
              </h2>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
                {p.achievements.map((a) => (
                  <li key={a.id}>{achievementLine(a)}</li>
                ))}
              </ul>
            </section>
          ))
        )}
      </article>
    </div>
  );
}
