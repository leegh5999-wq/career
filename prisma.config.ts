// Prisma CLI 설정 — 마이그레이션·introspect가 사용할 DB 연결을 지정 (Prisma 7)
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 마이그레이션은 풀러를 거치지 않는 직접(5432) 연결을 사용
    url: env("DIRECT_URL"),
  },
});
