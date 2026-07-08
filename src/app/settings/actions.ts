"use server";
// 프로필(출력물 기본 정보) 저장 서버 액션
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function upsertProfile(formData: FormData) {
  const text = (key: string): string | null => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };

  const name = text("name");
  if (!name) throw new Error("이름은 필수입니다.");

  const data = {
    name,
    jobTitle: text("jobTitle"),
    email: text("email"),
    phone: text("phone"),
    summary: text("summary"),
  };

  await prisma.profile.upsert({
    where: { id: "main" },
    create: { id: "main", ...data },
    update: data,
  });
  revalidatePath("/settings");
}
