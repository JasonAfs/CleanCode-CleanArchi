/*
  Warnings:

  - You are about to drop the `company_motorcycles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `motorcycles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "company_motorcycles" DROP CONSTRAINT "company_motorcycles_companyId_fkey";

-- DropForeignKey
ALTER TABLE "company_motorcycles" DROP CONSTRAINT "company_motorcycles_motorcycleId_fkey";

-- DropForeignKey
ALTER TABLE "motorcycles" DROP CONSTRAINT "motorcycles_dealershipId_fkey";

-- DropTable
DROP TABLE "company_motorcycles";

-- DropTable
DROP TABLE "motorcycles";

-- DropEnum
DROP TYPE "MotorcycleStatus";
