"use server";
// 프로필(출력물 기본 정보) 저장 서버 액션
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { text } from "@/lib/form";

export async function upsertProfile(formData: FormData) {
  const name = text(formData, "name");
  if (!name) throw new Error("이름은 필수입니다.");

  const data = {
    name,
    jobTitle: text(formData, "jobTitle"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    summary: text(formData, "summary"),
  };

  await prisma.profile.upsert({
    where: { id: "main" },
    create: { id: "main", ...data },
    update: data,
  });
  revalidatePath("/settings");
}
