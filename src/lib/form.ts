// 서버 액션 공용 FormData 파싱 헬퍼 — 모든 액션이 동일한 파싱 정책을 공유
export function text(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export function num(formData: FormData, key: string): number | null {
  const v = text(formData, key);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function int(formData: FormData, key: string): number | null {
  const n = num(formData, key);
  return n === null ? null : Math.trunc(n);
}

// 유효하지 않은 날짜 문자열은 null로 (Invalid Date가 Prisma까지 흘러가는 것 방지)
export function date(formData: FormData, key: string): Date | null {
  const v = text(formData, key);
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function list(formData: FormData, key: string): string[] {
  return (
    text(formData, key)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? []
  );
}

// enum 객체에 존재하는 값이면 그대로, 아니면 fallback
export function enumOr<T extends string>(
  enumObj: Record<string, T>,
  value: string | null,
  fallback: T,
): T {
  return value && Object.hasOwn(enumObj, value) ? (value as T) : fallback;
}
