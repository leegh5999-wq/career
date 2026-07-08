// 로그인 페이지 — 비밀번호 1개로 앱 전체를 보호
import { inputCls } from "@/lib/ui";
import { SubmitButton } from "@/components/submit-button";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto mt-24 max-w-xs">
      <h1 className="text-xl font-semibold">경력 관리</h1>
      <p className="mt-1 text-sm text-zinc-500">비밀번호를 입력하세요.</p>
      <form action={login} className="mt-4 flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          autoFocus
          aria-label="비밀번호"
          className={`${inputCls} w-full`}
        />
        {error && (
          <p className="text-sm text-red-600">비밀번호가 올바르지 않습니다.</p>
        )}
        <SubmitButton>로그인</SubmitButton>
      </form>
    </div>
  );
}
