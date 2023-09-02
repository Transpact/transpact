/*
  Warnings:

  - A unique constraint covering the columns `[acceptedBidderId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "acceptedBidderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_acceptedBidderId_key" ON "Contract"("acceptedBidderId");

-- CreateIndex
CREATE INDEX "Contract_acceptedBidderId_idx" ON "Contract"("acceptedBidderId");
