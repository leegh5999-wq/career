// 프로젝트 등록·수정 공용 폼 — 기본정보/규모/설계범위/산출물 섹션으로 구성
import type { Project } from "@/generated/prisma/client";
import { DesignScope, ProjectStatus } from "@/generated/prisma/enums";
import { designScopeLabels, projectStatusLabels } from "@/lib/labels";
import { toDateInput } from "@/lib/format";
import { inputCls as baseInputCls } from "@/lib/ui";
import { SubmitButton } from "@/components/submit-button";

const inputCls = `w-full ${baseInputCls}`;
const labelCls = "block text-sm font-medium text-zinc-700";
const sectionCls = "rounded-lg border border-zinc-200 bg-white p-5";
const legendCls = "mb-3 text-sm font-semibold text-zinc-900";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelCls}>
        {label}
        <div className="mt-1">{children}</div>
      </label>
    </div>
  );
}

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <section className={sectionCls}>
        <h2 className={legendCls}>기본정보</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="프로젝트명 *" className="sm:col-span-2">
            <input
              name="name"
              required
              defaultValue={project?.name}
              placeholder="○○지구 공동주택 신축공사"
              className={inputCls}
            />
          </Field>
          <Field label="발주처">
            <input
              name="client"
              defaultValue={project?.client ?? ""}
              placeholder="○○공사, ○○건설"
              className={inputCls}
            />
          </Field>
          <Field label="용도">
            <input
              name="buildingUse"
              defaultValue={project?.buildingUse ?? ""}
              placeholder="공동주택, 오피스, 플랜트"
              className={inputCls}
            />
          </Field>
          <Field label="소속사">
            <input
              name="company"
              defaultValue={project?.company ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="역할·담당범위">
            <input
              name="role"
              defaultValue={project?.role ?? ""}
              placeholder="전기설계 담당, 통신 파트장"
              className={inputCls}
            />
          </Field>
          <Field label="참여 시작일">
            <input
              type="date"
              name="startDate"
              defaultValue={toDateInput(project?.startDate ?? null)}
              className={inputCls}
            />
          </Field>
          <Field label="참여 종료일">
            <input
              type="date"
              name="endDate"
              defaultValue={toDateInput(project?.endDate ?? null)}
              className={inputCls}
            />
          </Field>
          <Field label="상태">
            <select
              name="status"
              defaultValue={project?.status ?? ProjectStatus.IN_PROGRESS}
              className={inputCls}
            >
              {Object.values(ProjectStatus).map((s) => (
                <option key={s} value={s}>
                  {projectStatusLabels[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className={legendCls}>사업규모</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="연면적 (㎡)">
            <input
              type="number"
              step="any"
              name="grossFloorArea"
              defaultValue={project?.grossFloorArea ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="수전용량 (kVA)">
            <input
              type="number"
              step="any"
              name="powerCapacity"
              defaultValue={project?.powerCapacity ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="세대수">
            <input
              type="number"
              name="householdCount"
              defaultValue={project?.householdCount ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="기타 규모 메모" className="sm:col-span-3">
            <input
              name="scaleNote"
              defaultValue={project?.scaleNote ?? ""}
              placeholder="지하 2층·지상 15층, 3개동"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className={legendCls}>담당 설계범위</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.values(DesignScope).map((scope) => (
            <label
              key={scope}
              className="flex items-center gap-2 text-sm text-zinc-700"
            >
              <input
                type="checkbox"
                name="designScopes"
                value={scope}
                defaultChecked={project?.designScopes.includes(scope)}
                className="h-4 w-4 rounded border-zinc-300"
              />
              {designScopeLabels[scope]}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Field label="설계범위 상세">
            <textarea
              name="scopeDetail"
              rows={3}
              defaultValue={project?.scopeDetail ?? ""}
              placeholder="담당 구간·설비 상세 설명"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className={legendCls}>산출물</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="도면 수량 (장)">
            <input
              type="number"
              name="drawingCount"
              defaultValue={project?.drawingCount ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="계산서 (쉼표로 구분)">
            <input
              name="calcTypes"
              defaultValue={project?.calcTypes.join(", ") ?? ""}
              placeholder="부하계산, 전압강하, 조도"
              className={inputCls}
            />
          </Field>
          <Field label="사용 툴 (쉼표로 구분)">
            <input
              name="tools"
              defaultValue={project?.tools.join(", ") ?? ""}
              placeholder="AutoCAD, Revit"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <div>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
