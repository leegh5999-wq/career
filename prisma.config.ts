// Prisma CLI 설정 — 마이그레이션·introspect가 사용할 DB 연결을 지정 (Prisma 7)
import "dotenv/config";
import { defineConfig } from "prisma/config";

// 플랫폼 환경변수의 BOM·따옴표·공백 오염 제거 (Vercel 저장값 이슈 대응)
const directUrl = (process.env.DIRECT_URL ?? "")
  .replace(/^[\s"']+/, "")
  .replace(/[\s"']+$/, "");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 마이그레이션은 풀러 세션 모드(5432) 연결을 사용
    url: directUrl,
  },
});
