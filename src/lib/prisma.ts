// Prisma 클라이언트 싱글턴 — pg 어댑터로 Supabase 풀러에 연결하고, 개발 중 핫 리로드 커넥션 중복을 방지
// 주의: 플랫폼 환경변수에 보이지 않는 문자(CR, 따옴표 등)가 섞일 수 있어
// 값을 정화한 뒤 URL을 직접 분해해 명시적 필드로 전달한다. (번들된 pg 파서 오동작 회피 겸용)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// 앞뒤 공백·제어문자·따옴표 제거
export function sanitizeUrl(raw: string): string {
  return raw.replace(/[\s"']+$/g, "").replace(/^[\s"']+/g, "");
}

function makeAdapter() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return new PrismaPg({});
  try {
    const u = new URL(sanitizeUrl(raw));
    return new PrismaPg({
      host: u.hostname,
      port: Number(u.port) || 5432,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.slice(1) || "postgres",
    });
  } catch {
    // URL 파싱 실패 시 원본 문자열로 폴백 (빌드 단계에서 throw 방지)
    return new PrismaPg({ connectionString: raw });
  }
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: makeAdapter() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
