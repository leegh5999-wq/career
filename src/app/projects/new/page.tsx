// 프로젝트 등록 페이지
import { createProject } from "../actions";
import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">새 프로젝트</h1>
      <ProjectForm action={createProject} submitLabel="등록" />
    </div>
  );
}
