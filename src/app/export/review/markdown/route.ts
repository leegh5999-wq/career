// 성과평가 자료 마크다운 다운로드 라우트
import { prisma } from "@/lib/prisma";
import { buildReviewMarkdown } from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const fromDate = from
    ? new Date(from)
    : new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));
  const toDate = to ? new Date(`${to}T23:59:59.999Z`) : new Date();

  const projects = await prisma.project.findMany({
    where: {
      achievements: { some: { occurredAt: { gte: fromDate, lte: toDate } } },
    },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    include: {
      achievements: {
        where: { occurredAt: { gte: fromDate, lte: toDate } },
        orderBy: { occurredAt: "asc" },
      },
    },
  });

  const md = buildReviewMarkdown(fromDate, toDate, projects);
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition":
        "attachment; filename=\"review.md\"; filename*=UTF-8''%EC%84%B1%EA%B3%BC%EC%A0%95%EB%A6%AC.md",
    },
  });
}
