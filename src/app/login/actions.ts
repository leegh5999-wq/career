"use server";
// 로그인 서버 액션 — 비밀번호 검증 후 인증 쿠키 발급
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const pw = process.env.APP_PASSWORD?.trim();
  const input = formData.get("password");

  if (!pw || typeof input !== "string" || input.trim() !== pw) {
    redirect("/login?error=1");
  }

  const token = createHash("sha256").update(`career-auth:${pw}`).digest("hex");
  const cookieStore = await cookies();
  cookieStore.set("career_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect("/");
}
