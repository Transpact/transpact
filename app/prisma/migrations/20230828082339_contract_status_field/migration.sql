-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('CREATED', 'BIDDER_FOUND', 'APPROVAL_PENDING', 'APPROVED', 'SIGNED');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "status" "ContractStatus" NOT NULL DEFAULT 'CREATED';
