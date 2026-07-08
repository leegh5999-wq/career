// Prisma enum 값을 화면 표시용 한글 라벨로 매핑
import type {
  AchievementCategory,
  CertificationKind,
  DesignScope,
  ProjectStatus,
} from "@/generated/prisma/enums";

export const designScopeLabels: Record<DesignScope, string> = {
  SUBSTATION: "수변전",
  POWER_TRUNK: "간선·동력",
  LIGHTING: "조명",
  GROUNDING_LIGHTNING: "접지·피뢰",
  EMERGENCY_POWER: "예비전원",
  FIRE_ELECTRIC: "소방전기",
  PREMISES_COMM: "구내통신",
  BROADCAST_RECEPTION: "방송공동수신",
  ICT_FACILITY: "정보통신설비",
  SECURITY_CCTV: "CCTV·방범",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  ON_HOLD: "보류",
};

export const certificationKindLabels: Record<CertificationKind, string> = {
  LICENSE: "자격증",
  EDUCATION: "교육",
};

export const achievementCategoryLabels: Record<AchievementCategory, string> = {
  COST_SAVING: "비용절감",
  SCHEDULE: "공기단축",
  QUALITY: "품질",
  SAFETY: "안전",
  TECH_IMPROVEMENT: "기술개선",
  OTHER: "기타",
};
