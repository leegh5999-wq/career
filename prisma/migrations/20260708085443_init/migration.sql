-- CreateEnum
CREATE TYPE "DesignScope" AS ENUM ('SUBSTATION', 'POWER_TRUNK', 'LIGHTING', 'GROUNDING_LIGHTNING', 'EMERGENCY_POWER', 'FIRE_ELECTRIC', 'PREMISES_COMM', 'BROADCAST_RECEPTION', 'ICT_FACILITY', 'SECURITY_CCTV');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('COST_SAVING', 'SCHEDULE', 'QUALITY', 'SAFETY', 'TECH_IMPROVEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "CertificationKind" AS ENUM ('LICENSE', 'EDUCATION');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "client" TEXT,
    "buildingUse" TEXT,
    "grossFloorArea" DOUBLE PRECISION,
    "powerCapacity" DOUBLE PRECISION,
    "householdCount" INTEGER,
    "scaleNote" TEXT,
    "role" TEXT,
    "company" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "designScopes" "DesignScope"[],
    "scopeDetail" TEXT,
    "drawingCount" INTEGER,
    "calcTypes" TEXT[],
    "tools" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "refinedText" TEXT,
    "category" "AchievementCategory" NOT NULL DEFAULT 'OTHER',
    "metricValue" DOUBLE PRECISION,
    "metricUnit" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "CertificationKind" NOT NULL DEFAULT 'LICENSE',
    "issuer" TEXT,
    "acquiredAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
