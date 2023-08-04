-- CreateEnum
CREATE TYPE "UserTypes" AS ENUM ('BIDDER', 'LISTER');

-- CreateTable
CREATE TABLE "PrismaContract" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'testContract',

    CONSTRAINT "PrismaContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "wallet_address" VARCHAR(100) NOT NULL,
    "industry_type" VARCHAR(100) NOT NULL,
    "user_type" "UserTypes" NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "region" VARCHAR(150) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "address" TEXT NOT NULL,
    "company_name" VARCHAR(150) NOT NULL,
    "company_logo" TEXT NOT NULL,
    "tax_identification_number" VARCHAR(100) NOT NULL,
    "registration_document_type" VARCHAR(100) NOT NULL,
    "buisness_registration_document" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
