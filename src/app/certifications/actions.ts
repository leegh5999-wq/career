"use server";
// 자격·교육 이력 등록·삭제 서버 액션
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { date, enumOr, text } from "@/lib/form";
import { CertificationKind } from "@/generated/prisma/enums";

export async function createCertification(formData: FormData) {
  const name = text(formData, "name");
  if (!name) throw new Error("자격·교육명은 필수입니다.");

  await prisma.certification.create({
    data: {
      name,
      kind: enumOr(
        CertificationKind,
        text(formData, "kind"),
        CertificationKind.LICENSE,
      ),
      issuer: text(formData, "issuer"),
      acquiredAt: date(formData, "acquiredAt"),
      expiresAt: date(formData, "expiresAt"),
      note: text(formData, "note"),
    },
  });
  revalidatePath("/certifications");
}

export async function deleteCertification(id: string) {
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/certifications");
}
