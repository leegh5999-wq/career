"use client";
// 확인창을 띄운 뒤 서버 액션을 실행하는 범용 버튼
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
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
