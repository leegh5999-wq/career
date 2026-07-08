// 경력기술서 마크다운 다운로드 라우트
import { prisma } from "@/lib/prisma";
import { buildCareerMarkdown } from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET() {
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

  const md = buildCareerMarkdown(profile, projects, certifications);
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition":
        "attachment; filename=\"career.md\"; filename*=UTF-8''%EA%B2%BD%EB%A0%A5%EA%B8%B0%EC%88%A0%EC%84%9C.md",
    },
  });
}
