-- CreateEnum
CREATE TYPE "ContractTypes" AS ENUM ('FIXED_PRICE', 'HOURLY', 'MILESTONE_BASED');

-- CreateEnum
CREATE TYPE "ContractVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'INVITE');

-- CreateEnum
CREATE TYPE "PaymentMethods" AS ENUM ('BANK_TRANSFER', 'TRANSPACT_FUND_WALLET', 'CASH');

-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "contract_type" "ContractTypes" NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "skills_required" TEXT[],
    "legal_requirements" VARCHAR(500) NOT NULL,
    "payment_method" "PaymentMethods" NOT NULL,
    "total_amount" INTEGER NOT NULL DEFAULT 0,
    "renewal" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "contract_visibility" "ContractVisibility" NOT NULL,
    "contract_duration" VARCHAR(20) NOT NULL,
    "budget_range" VARCHAR(60) NOT NULL,
    "files" TEXT[],
    "creatorId" TEXT NOT NULL,
    "bidderId" TEXT,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContractToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Contract_creatorId_idx" ON "Contract"("creatorId");

-- CreateIndex
CREATE INDEX "Contract_bidderId_idx" ON "Contract"("bidderId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContractToUser_AB_unique" ON "_ContractToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ContractToUser_B_index" ON "_ContractToUser"("B");
