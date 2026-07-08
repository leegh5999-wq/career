"use server";
// 프로젝트 등록·수정·삭제 서버 액션 — 폼 데이터를 파싱해 Prisma로 반영
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  AchievementCategory,
  DesignScope,
  ProjectStatus,
} from "@/generated/prisma/enums";

function parseProjectForm(formData: FormData) {
  const text = (key: string): string | null => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  const num = (key: string): number | null => {
    const v = text(key);
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const int = (key: string): number | null => {
    const n = num(key);
    return n === null ? null : Math.trunc(n);
  };
  const date = (key: string): Date | null => {
    const v = text(key);
    return v ? new Date(v) : null;
  };
  const list = (key: string): string[] =>
    text(key)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const name = text("name");
  if (!name) throw new Error("프로젝트명은 필수입니다.");

  const statusValue = text("status");
  const status =
    statusValue && Object.hasOwn(ProjectStatus, statusValue)
      ? (statusValue as ProjectStatus)
      : ProjectStatus.IN_PROGRESS;

  const designScopes = formData
    .getAll("designScopes")
    .filter(
      (v): v is DesignScope =>
        typeof v === "string" && Object.hasOwn(DesignScope, v),
    );

  return {
    name,
    client: text("client"),
    buildingUse: text("buildingUse"),
    grossFloorArea: num("grossFloorArea"),
    powerCapacity: num("powerCapacity"),
    householdCount: int("householdCount"),
    scaleNote: text("scaleNote"),
    role: text("role"),
    company: text("company"),
    startDate: date("startDate"),
    endDate: date("endDate"),
    status,
    designScopes,
    scopeDetail: text("scopeDetail"),
    drawingCount: int("drawingCount"),
    calcTypes: list("calcTypes"),
    tools: list("tools"),
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
  const text = (key: string): string | null => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };

  const projectId = text("projectId");
  const rawText = text("rawText");
  if (!projectId || !rawText) throw new Error("프로젝트와 내용은 필수입니다.");

  const categoryValue = text("category");
  const category =
    categoryValue && Object.hasOwn(AchievementCategory, categoryValue)
      ? (categoryValue as AchievementCategory)
      : AchievementCategory.OTHER;

  const metricRaw = text("metricValue");
  const metricValue =
    metricRaw && Number.isFinite(Number(metricRaw)) ? Number(metricRaw) : null;

  const dateRaw = text("occurredAt");

  await prisma.achievement.create({
    data: {
      projectId,
      rawText,
      category,
      metricValue,
      metricUnit: text("metricUnit"),
      ...(dateRaw ? { occurredAt: new Date(dateRaw) } : {}),
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
