"use client";
// 제출 중 자동 비활성화되는 공용 제출 버튼 (더블서밋 방지)
import { useFormStatus } from "react-dom";
import { btnPrimaryCls } from "@/lib/ui";

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className ?? btnPrimaryCls}>
      {pending ? "저장 중…" : children}
    </button>
  );
}
