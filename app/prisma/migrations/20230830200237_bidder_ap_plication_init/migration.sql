/*
  Warnings:

  - You are about to drop the `_ContractToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "PaymentMethods" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_ContractToUser";

-- CreateTable
CREATE TABLE "BidderApplication" (
    "id" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,

    CONSTRAINT "BidderApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BidderApplication_bidderId_idx" ON "BidderApplication"("bidderId");

-- CreateIndex
CREATE INDEX "Contract_userId_idx" ON "Contract"("userId");
