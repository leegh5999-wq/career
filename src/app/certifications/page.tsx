// 자격·교육 이력 + 경력기간 합산 — 기술등급 산정의 두 재료를 관리
import { prisma } from "@/lib/prisma";
import { CertificationKind } from "@/generated/prisma/enums";
import { certificationKindLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import {
  formatDuration,
  intervalDays,
  projectInterval,
  totalCareerDays,
} from "@/lib/career";
import { periodText } from "@/lib/export";
import { ConfirmButton } from "@/components/confirm-button";
import { createCertification, deleteCertification } from "./actions";

export const dynamic = "force-dynamic";

const inputCls =
  "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none";

export default async function CertificationsPage() {
  const [certifications, projects] = await Promise.all([
    prisma.certification.findMany({
      orderBy: [{ acquiredAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.project.findMany({
      orderBy: [{ startDate: "asc" }],
    }),
  ]);

  const today = new Date();
  const totalDays = totalCareerDays(projects, today);
  const projectRows = projects
    .map((p) => ({ p, interval: projectInterval(p, today) }))
    .filter((r) => r.interval !== null);

  const licenses = certifications.filter((c) => c.kind === "LICENSE");
  const educations = certifications.filter((c) => c.kind === "EDUCATION");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">자격·교육</h1>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold">경력기간 합산</h2>
        <p className="mt-2 text-2xl font-semibold">
          {formatDuration(totalDays)}
          <span className="ml-2 text-sm font-normal text-zinc-400">
            총 {totalDays.toLocaleString()}일 · 중복 기간 제거 · 진행중은 오늘까지
          </span>
        </p>
        {projectRows.length > 0 && (
          <ul className="mt-3 divide-y divide-zinc-100 text-sm">
            {projectRows.map(({ p, interval }) => (
              <li key={p.id} className="flex items-center justify-between py-1.5">
                <span className="text-zinc-700">{p.name}</span>
                <span className="text-zinc-500">
                  {periodText(p)} ·{" "}
                  {intervalDays(interval!.start, interval!.end).toLocaleString()}일
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-zinc-400">
          협회 경력신고·기술등급 산정 참고용 근사치입니다. 공식 인정 기간은 신고
          기관 기준을 따릅니다.
        </p>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold">자격·교육 추가</h2>
        <form action={createCertification} className="flex flex-wrap items-center gap-2">
          <select name="kind" className={inputCls}>
            {Object.values(CertificationKind).map((k) => (
              <option key={k} value={k}>
                {certificationKindLabels[k]}
              </option>
            ))}
          </select>
          <input
            name="name"
            required
            placeholder="전기기사, 정보통신기사 …"
            className={`${inputCls} min-w-48 flex-1`}
          />
          <input name="issuer" placeholder="발급기관" className={`${inputCls} w-36`} />
          <input type="date" name="acquiredAt" title="취득·이수일" className={inputCls} />
          <input type="date" name="expiresAt" title="만료일(해당 시)" className={inputCls} />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            추가
          </button>
        </form>
      </section>

      {(
        [
          ["자격증", licenses],
          ["교육 이수", educations],
        ] as const
      ).map(([title, items]) => (
        <section key={title} className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">
            {title}
            <span className="ml-2 font-normal text-zinc-400">{items.length}건</span>
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-zinc-500">등록된 항목이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {items.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-2">
                  <div className="min-w-0 flex-1 text-sm">
                    <span className="font-medium text-zinc-800">{c.name}</span>
                    <span className="ml-2 text-zinc-500">
                      {[
                        c.issuer,
                        c.acquiredAt && `취득 ${formatDate(c.acquiredAt)}`,
                        c.expiresAt && `만료 ${formatDate(c.expiresAt)}`,
                        c.note,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                  <ConfirmButton
                    action={deleteCertification.bind(null, c.id)}
                    message={`"${c.name}" 항목을 삭제할까요?`}
                    className="shrink-0 text-xs text-zinc-300 hover:text-red-500"
                  >
                    삭제
                  </ConfirmButton>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
