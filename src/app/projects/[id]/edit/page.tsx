// 프로젝트 수정 페이지 — 기존 값을 채운 폼과 삭제 버튼
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteProject, updateProject } from "../../actions";
import { ProjectForm } from "../../project-form";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">프로젝트 수정</h1>
      <ProjectForm
        action={updateProject.bind(null, id)}
        project={project}
        submitLabel="저장"
      />
      <div className="mt-8 border-t border-zinc-200 pt-6">
        <DeleteButton action={deleteProject.bind(null, id)} />
      </div>
    </div>
  );
}
