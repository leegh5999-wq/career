// 프로젝트 목록 — 등록된 프로젝트(현장)를 카드로 나열
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { designScopeLabels, projectStatusLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusBadgeCls = {
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
  ON_HOLD: "bg-amber-50 text-amber-700",
} as const;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { startDate: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      status: true,
      client: true,
      buildingUse: true,
      startDate: true,
      endDate: true,
      designScopes: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">프로젝트</h1>
        <Link
          href="/projects/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + 새 프로젝트
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          아직 등록된 프로젝트가 없습니다. 첫 프로젝트를 등록해 보세요.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="block rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-400"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{p.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusBadgeCls[p.status]}`}
                  >
                    {projectStatusLabels[p.status]}
                  </span>
                </div>
                <div className="mt-1 text-sm text-zinc-600">
                  {[p.client, p.buildingUse].filter(Boolean).join(" · ") ||
                    "발주처 미입력"}
                  <span className="mx-2 text-zinc-300">|</span>
                  {formatDate(p.startDate)} ~ {formatDate(p.endDate)}
                </div>
                {p.designScopes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.designScopes.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600"
                      >
                        {designScopeLabels[s]}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
