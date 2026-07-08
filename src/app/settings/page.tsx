// 설정 — 출력물(경력기술서 등)에 들어갈 프로필 정보 관리
import { prisma } from "@/lib/prisma";
import { upsertProfile } from "./actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none";
const labelCls = "block text-sm font-medium text-zinc-700";

export default async function SettingsPage() {
  const profile = await prisma.profile.findUnique({ where: { id: "main" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">설정</h1>
      <p className="mt-1 text-sm text-zinc-500">
        경력기술서 등 출력물 상단에 표시될 정보입니다.
      </p>

      <form
        action={upsertProfile}
        className="mt-6 max-w-lg rounded-lg border border-zinc-200 bg-white p-5"
      >
        <div className="flex flex-col gap-4">
          <label className={labelCls}>
            이름 *
            <input
              name="name"
              required
              defaultValue={profile?.name ?? ""}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className={labelCls}>
            직함·직무
            <input
              name="jobTitle"
              defaultValue={profile?.jobTitle ?? ""}
              placeholder="전기설계 엔지니어"
              className={`${inputCls} mt-1`}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelCls}>
              이메일
              <input
                type="email"
                name="email"
                defaultValue={profile?.email ?? ""}
                className={`${inputCls} mt-1`}
              />
            </label>
            <label className={labelCls}>
              연락처
              <input
                name="phone"
                defaultValue={profile?.phone ?? ""}
                className={`${inputCls} mt-1`}
              />
            </label>
          </div>
          <label className={labelCls}>
            경력 요약
            <textarea
              name="summary"
              rows={3}
              defaultValue={profile?.summary ?? ""}
              placeholder="전기·통신 설계 n년차, 공동주택·오피스 중심"
              className={`${inputCls} mt-1`}
            />
          </label>
          <div>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              저장
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
