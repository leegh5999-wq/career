// Prisma enum 값을 화면 표시용 한글 라벨로 매핑
import type {
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
