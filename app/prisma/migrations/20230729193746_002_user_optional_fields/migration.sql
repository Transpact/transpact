-- AlterTable
ALTER TABLE "User" ALTER COLUMN "wallet_address" DROP NOT NULL,
ALTER COLUMN "industry_type" DROP NOT NULL,
ALTER COLUMN "user_type" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "region" DROP NOT NULL,
ALTER COLUMN "postal_code" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "company_name" DROP NOT NULL,
ALTER COLUMN "company_logo" DROP NOT NULL,
ALTER COLUMN "tax_identification_number" DROP NOT NULL,
ALTER COLUMN "registration_document_type" DROP NOT NULL,
ALTER COLUMN "buisness_registration_document" DROP NOT NULL;
