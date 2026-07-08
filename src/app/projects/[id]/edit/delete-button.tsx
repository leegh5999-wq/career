"use client";
// 삭제 확인창을 띄운 뒤 서버 액션을 실행하는 버튼
export function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("정말 삭제할까요? 이 프로젝트의 성과 기록도 함께 삭제됩니다.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        프로젝트 삭제
      </button>
    </form>
  );
}
