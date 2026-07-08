// 성과평가 자료 마크다운 다운로드 라우트 — 인쇄 페이지와 동일한 데이터·기간 규칙 사용
import {
  buildReviewMarkdown,
  getReviewProjects,
  parseReviewRange,
} from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { fromStr, toStr, fromDate, toDate } = parseReviewRange(
    searchParams.get("from"),
    searchParams.get("to"),
  );

  const projects = await getReviewProjects(fromDate, toDate);

  const md = buildReviewMarkdown(fromStr, toStr, projects);
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition":
        "attachment; filename=\"review.md\"; filename*=UTF-8''%EC%84%B1%EA%B3%BC%EC%A0%95%EB%A6%AC.md",
    },
  });
}
