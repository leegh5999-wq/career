// 공용 UI 클래스 문자열 — 폼·버튼 스타일을 한 곳에서 관리
export const inputCls =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500";

export const btnPrimaryCls = `rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 ${focusRing}`;

export const btnSecondaryCls = `rounded-md border border-zinc-300 px-4 py-2 text-sm hover:border-zinc-500 ${focusRing}`;

export const btnDangerCls = `rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${focusRing}`;

// 회색 정보 칩 (설계범위 등) — pill(상태)과 달리 분류·태그는 4px 모서리
export const chipCls = "rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600";
