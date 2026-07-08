// 비밀번호 보호 미들웨어 — 인증 쿠키가 없으면 모든 경로를 /login으로 돌린다
import { NextResponse, type NextRequest } from "next/server";

// APP_PASSWORD에서 파생한 토큰 (쿠키 값과 비교). trim()이 BOM·개행 오염도 제거한다.
async function expectedToken(): Promise<string | null> {
  const pw = process.env.APP_PASSWORD?.trim();
  if (!pw) return null;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`career-auth:${pw}`),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const expected = await expectedToken();
  // 비밀번호 미설정 시 보호 없이 통과 (로컬 개발 편의)
  if (!expected) return NextResponse.next();

  if (request.nextUrl.pathname === "/login") return NextResponse.next();

  const token = request.cookies.get("career_auth")?.value;
  if (token === expected) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
