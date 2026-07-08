// 날짜 표시·입력 포맷 유틸 — "오늘"은 항상 KST 기준으로 계산 (서버는 UTC라 하루 밀림 방지)
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

// KST 기준 오늘 날짜 "yyyy-MM-dd"
export function todayKstInput(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}

// KST 기준 오늘을 UTC 자정 Date로 — 날짜(UTC 자정)로 저장된 값들과의 일수 계산용
export function todayKstUtcMidnight(): Date {
  return new Date(`${todayKstInput()}T00:00:00Z`);
}
