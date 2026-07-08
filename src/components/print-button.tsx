"use client";
// 브라우저 인쇄(PDF 저장) 버튼
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
    >
      인쇄 / PDF 저장
    </button>
  );
}
