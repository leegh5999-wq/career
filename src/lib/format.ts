// 날짜 표시·입력 포맷 유틸
export function formatDate(date: Date | null): string {
  if (!date) return "-";
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

// input[type=date]의 defaultValue용 "yyyy-MM-dd" 문자열
export function toDateInput(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}
