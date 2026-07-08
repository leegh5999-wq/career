// 경력기술서 — 인쇄(PDF 저장)에 최적화된 전체 프로젝트 경력 문서
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  designScopeLabels,
  projectStatusLabels,
} from "@/lib/labels";
import {
  achievementLine,
  certificationLine,
  periodText,
  scaleText,
} from "@/lib/export";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

export default async function CareerExportPage() {
  const [profile, projects, certifications] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "main" } }),
    prisma.project.findMany({
      orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
      include: { achievements: { orderBy: { occurredAt: "asc" } } },
    }),
    prisma.certification.findMany({
      orderBy: [{ acquiredAt: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Link href="/export" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← 출력
        </Link>
        <div className="flex gap-2">
          <a
            href="/export/career/markdown"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:border-zinc-500"
          >
            마크다운 다운로드
          </a>
          <PrintButton />
        </div>
      </div>

      <article className="rounded-lg border border-zinc-200 bg-white p-8 print:border-0 print:p-0">
        <h1 className="text-2xl font-bold">경력기술서</h1>

        {profile ? (
          <div className="mt-3 text-sm text-zinc-700">
            <p className="text-base font-semibold text-zinc-900">
              {profile.name}
              {profile.jobTitle && (
                <span className="ml-2 font-normal text-zinc-500">
                  {profile.jobTitle}
                </span>
              )}
            </p>
            <p className="mt-0.5 text-zinc-500">
              {[profile.email, profile.phone].filter(Boolean).join(" · ")}
            </p>
            {profile.summary && <p className="mt-2">{profile.summary}</p>}
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-400 print:hidden">
            <Link href="/settings" className="underline">
              설정
            </Link>
            에서 이름·연락처를 입력하면 여기에 표시됩니다.
          </p>
        )}

        {certifications.length > 0 && (
          <>
            <h2 className="mt-8 border-b border-zinc-300 pb-1 text-lg font-semibold">
              보유 자격·교육 ({certifications.length}건)
            </h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-zinc-700">
              {certifications.map((c) => (
                <li key={c.id}>{certificationLine(c)}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="mt-8 border-b border-zinc-300 pb-1 text-lg font-semibold">
          프로젝트 경력 ({projects.length}건)
        </h2>

        {projects.map((p) => (
          <section key={p.id} className="mt-6 break-inside-avoid">
            <h3 className="font-semibold">{p.name}</h3>
            <dl className="mt-1.5 text-sm text-zinc-700">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-zinc-400">기간</dt>
                <dd>
                  {periodText(p)} ({projectStatusLabels[p.status]})
                </dd>
              </div>
              {(p.client || p.buildingUse || p.company || p.role) && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-zinc-400">기본정보</dt>
                  <dd>
                    {[
                      p.client && `발주처 ${p.client}`,
                      p.buildingUse && `용도 ${p.buildingUse}`,
                      p.company && `소속 ${p.company}`,
                      p.role && `역할 ${p.role}`,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </dd>
                </div>
              )}
              {scaleText(p) && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-zinc-400">규모</dt>
                  <dd>{scaleText(p)}</dd>
                </div>
              )}
              {p.designScopes.length > 0 && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-zinc-400">설계범위</dt>
                  <dd>
                    {p.designScopes.map((s) => designScopeLabels[s]).join(", ")}
                    {p.scopeDetail && ` — ${p.scopeDetail}`}
                  </dd>
                </div>
              )}
              {(p.drawingCount || p.calcTypes.length > 0 || p.tools.length > 0) && (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-zinc-400">산출물</dt>
                  <dd>
                    {[
                      p.drawingCount && `도면 ${p.drawingCount}장`,
                      p.calcTypes.length > 0 && `계산서: ${p.calcTypes.join(", ")}`,
                      p.tools.length > 0 && `툴: ${p.tools.join(", ")}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </dd>
                </div>
              )}
            </dl>
            {p.achievements.length > 0 && (
              <div className="mt-2 text-sm">
                <p className="font-medium text-zinc-800">주요 성과</p>
                <ul className="mt-1 list-disc pl-5 text-zinc-700">
                  {p.achievements.map((a) => (
                    <li key={a.id}>{achievementLine(a)}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
