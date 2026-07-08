-- CreateIndex
CREATE INDEX "Achievement_projectId_occurredAt_idx" ON "Achievement"("projectId", "occurredAt");

-- CreateIndex
CREATE INDEX "Achievement_occurredAt_idx" ON "Achievement"("occurredAt");
