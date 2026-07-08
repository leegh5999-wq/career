// 대시보드 홈 — 빠른 성과 기록과 최근 성과·진행중 프로젝트를 표시
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AchievementForm } from "@/components/achievement-form";
import { AchievementList } from "@/components/achievement-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, recentAchievements] = await Promise.all([
    prisma.project.findMany({
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
      select: { id: true, name: true, status: true },
    }),
    prisma.achievement.findMany({
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
      take: 10,
      include: { project: { select: { id: true, name: true } } },
    }),
  ]);

  const inProgress = projects.filter((p) => p.status === "IN_PROGRESS");

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold">오늘의 성과 기록</h2>
        {projects.length === 0 ? (
          <p className="text-sm text-zinc-500">
            먼저{" "}
            <Link href="/projects/new" className="underline hover:text-zinc-900">
              프로젝트를 등록
            </Link>
            하면 성과를 기록할 수 있습니다.
          </p>
        ) : (
          <AchievementForm projects={projects} />
        )}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold">최근 성과</h2>
        <AchievementList achievements={recentAchievements} />
      </section>

      {inProgress.length > 0 && (
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">진행중인 프로젝트</h2>
          <ul className="flex flex-col gap-1">
            {inProgress.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="text-sm text-zinc-700 hover:underline"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
