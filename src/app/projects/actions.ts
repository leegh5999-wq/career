"use server";
// 프로젝트·성과 로그 등록·수정·삭제 서버 액션
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { date, enumOr, int, list, num, text } from "@/lib/form";
import {
  AchievementCategory,
  DesignScope,
  ProjectStatus,
} from "@/generated/prisma/enums";

function parseProjectForm(formData: FormData) {
  const name = text(formData, "name");
  if (!name) throw new Error("프로젝트명은 필수입니다.");

  const startDate = date(formData, "startDate");
  const endDate = date(formData, "endDate");
  if (startDate && endDate && endDate < startDate) {
    throw new Error("참여 종료일이 시작일보다 빠릅니다.");
  }

  const designScopes = formData
    .getAll("designScopes")
    .filter(
      (v): v is DesignScope =>
        typeof v === "string" && Object.hasOwn(DesignScope, v),
    );

  return {
    name,
    client: text(formData, "client"),
    buildingUse: text(formData, "buildingUse"),
    grossFloorArea: num(formData, "grossFloorArea"),
    powerCapacity: num(formData, "powerCapacity"),
    householdCount: int(formData, "householdCount"),
    scaleNote: text(formData, "scaleNote"),
    role: text(formData, "role"),
    company: text(formData, "company"),
    startDate,
    endDate,
    status: enumOr(ProjectStatus, text(formData, "status"), ProjectStatus.IN_PROGRESS),
    designScopes,
    scopeDetail: text(formData, "scopeDetail"),
    drawingCount: int(formData, "drawingCount"),
    calcTypes: list(formData, "calcTypes"),
    tools: list(formData, "tools"),
  };
}

export async function createProject(formData: FormData) {
  const data = parseProjectForm(formData);
  const project = await prisma.project.create({ data });
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const data = parseProjectForm(formData);
  await prisma.project.update({ where: { id }, data });
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  redirect("/projects");
}

// --- 성과 로그 ---

export async function createAchievement(formData: FormData) {
  const projectId = text(formData, "projectId");
  const rawText = text(formData, "rawText");
  if (!projectId || !rawText) throw new Error("프로젝트와 내용은 필수입니다.");

  const occurredAt = date(formData, "occurredAt");

  await prisma.achievement.create({
    data: {
      projectId,
      rawText,
      category: enumOr(
        AchievementCategory,
        text(formData, "category"),
        AchievementCategory.OTHER,
      ),
      metricValue: num(formData, "metricValue"),
      metricUnit: text(formData, "metricUnit"),
      ...(occurredAt ? { occurredAt } : {}),
    },
  });
  revalidatePath("/");
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteAchievement(id: string) {
  const deleted = await prisma.achievement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath(`/projects/${deleted.projectId}`);
}
