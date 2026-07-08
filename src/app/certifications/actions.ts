"use server";
// 자격·교육 이력 등록·삭제 서버 액션
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CertificationKind } from "@/generated/prisma/enums";

export async function createCertification(formData: FormData) {
  const text = (key: string): string | null => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  const date = (key: string): Date | null => {
    const v = text(key);
    return v ? new Date(v) : null;
  };

  const name = text("name");
  if (!name) throw new Error("자격·교육명은 필수입니다.");

  const kindValue = text("kind");
  const kind =
    kindValue && Object.hasOwn(CertificationKind, kindValue)
      ? (kindValue as CertificationKind)
      : CertificationKind.LICENSE;

  await prisma.certification.create({
    data: {
      name,
      kind,
      issuer: text("issuer"),
      acquiredAt: date("acquiredAt"),
      expiresAt: date("expiresAt"),
      note: text("note"),
    },
  });
  revalidatePath("/certifications");
}

export async function deleteCertification(id: string) {
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/certifications");
}
