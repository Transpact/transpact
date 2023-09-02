/*
  Warnings:

  - You are about to drop the column `bidderId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the `Deliverable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contractId` to the `BidderApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Contract_bidderId_idx";

-- AlterTable
ALTER TABLE "BidderApplication" ADD COLUMN     "contractId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "bidderId";

-- DropTable
DROP TABLE "Deliverable";

-- DropTable
DROP TABLE "Milestone";
