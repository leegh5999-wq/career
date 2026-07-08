"use client";
// 확인창을 띄운 뒤 서버 액션을 실행하는 범용 버튼
// 하이드레이션 전에는 비활성화(확인창 없이 네이티브 제출되는 것 방지), 실행 중에도 비활성화(더블서밋 방지)
import { useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";

const emptySubscribe = () => () => {};

function ConfirmSubmit({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  // 서버 스냅숏 false → 클라이언트 true: 하이드레이션 완료 여부
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  return (
    <button
      type="submit"
      disabled={!hydrated || pending}
      className={`${className ?? ""} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

export function ConfirmButton({
  action,
  message,
  className,
  children,
}: {
  action: () => Promise<void>;
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <ConfirmSubmit className={className}>{children}</ConfirmSubmit>
    </form>
  );
}
