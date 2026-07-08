// Prisma 클라이언트 싱글턴 — pg 어댑터로 Supabase 풀러에 연결하고, 개발 중 핫 리로드 커넥션 중복을 방지
// 주의: 플랫폼 환경변수에 보이지 않는 문자(BOM, CR, 따옴표 등)가 섞일 수 있어
// 값을 정화한 뒤 URL을 직접 분해해 명시적 필드로 전달한다. (번들된 pg 파서 오동작 회피 겸용)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// 앞뒤 공백·제어문자·따옴표 제거
function sanitizeUrl(raw: string): string {
  return raw.replace(/[\s"']+$/, "").replace(/^[\s"']+/, "");
}

function makeAdapter() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.warn(
      "DATABASE_URL이 설정되지 않았습니다 — DB 연결이 localhost로 시도됩니다.",
    );
    return new PrismaPg({});
  }
  try {
    const u = new URL(sanitizeUrl(raw));
    const sslmode = u.searchParams.get("sslmode");
    return new PrismaPg({
      host: u.hostname,
      port: Number(u.port) || 5432,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.slice(1) || "postgres",
      // URL의 sslmode 파라미터를 존중 (필드 방식은 pg가 TLS를 자동 활성화하지 않음)
      ssl:
        sslmode && sslmode !== "disable"
          ? { rejectUnauthorized: false }
          : undefined,
      // 서버리스: 램다 인스턴스당 커넥션 상한을 낮게 유지
      max: 3,
    });
  } catch {
    // URL 파싱 실패 시 정화된 문자열로 폴백 (빌드 단계에서 throw 방지)
    return new PrismaPg({ connectionString: sanitizeUrl(raw) });
  }
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: makeAdapter() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
