// 프로젝트 상세 — 등록 정보 전체와 성과 로그(Phase 2)를 표시
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { designScopeLabels, projectStatusLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-1.5 text-sm">
      <dt className="w-28 shrink-0 text-zinc-500">{label}</dt>
      <dd className="text-zinc-900">{value || "-"}</dd>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {projectStatusLabels[project.status]} · {formatDate(project.startDate)}{" "}
            ~ {formatDate(project.endDate)}
          </p>
        </div>
        <Link
          href={`/projects/${project.id}/edit`}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:border-zinc-500"
        >
          수정
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">기본정보</h2>
          <dl>
            <Row label="발주처" value={project.client} />
            <Row label="용도" value={project.buildingUse} />
            <Row label="소속사" value={project.company} />
            <Row label="역할" value={project.role} />
          </dl>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">사업규모</h2>
          <dl>
            <Row
              label="연면적"
              value={
                project.grossFloorArea &&
                `${project.grossFloorArea.toLocaleString()} ㎡`
              }
            />
            <Row
              label="수전용량"
              value={
                project.powerCapacity &&
                `${project.powerCapacity.toLocaleString()} kVA`
              }
            />
            <Row
              label="세대수"
              value={
                project.householdCount &&
                `${project.householdCount.toLocaleString()} 세대`
              }
            />
            <Row label="기타" value={project.scaleNote} />
          </dl>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">담당 설계범위</h2>
          {project.designScopes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.designScopes.map((s) => (
                <span
                  key={s}
                  className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
                >
                  {designScopeLabels[s]}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">-</p>
          )}
          {project.scopeDetail && (
            <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">
              {project.scopeDetail}
            </p>
          )}
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">산출물</h2>
          <dl>
            <Row
              label="도면 수량"
              value={project.drawingCount && `${project.drawingCount} 장`}
            />
            <Row label="계산서" value={project.calcTypes.join(", ")} />
            <Row label="사용 툴" value={project.tools.join(", ")} />
          </dl>
        </section>
      </div>

      <section className="mt-4 rounded-lg border border-dashed border-zinc-300 p-5">
        <h2 className="text-sm font-semibold">성과 로그</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Phase 2에서 이 프로젝트의 성과를 한 줄씩 기록할 수 있습니다.
        </p>
      </section>
    </div>
  );
}
