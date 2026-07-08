// 경력기술서 마크다운 다운로드 라우트 — 인쇄 페이지와 동일한 데이터를 사용
import { buildCareerMarkdown, getCareerData } from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET() {
  const { profile, projects, certifications } = await getCareerData();

  const md = buildCareerMarkdown(profile, projects, certifications);
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition":
        "attachment; filename=\"career.md\"; filename*=UTF-8''%EA%B2%BD%EB%A0%A5%EA%B8%B0%EC%88%A0%EC%84%9C.md",
    },
  });
}
