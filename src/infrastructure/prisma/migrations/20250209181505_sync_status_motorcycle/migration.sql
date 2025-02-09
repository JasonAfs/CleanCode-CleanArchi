/*
  Warnings:

  - The values [IN_MAINTENANCE] on the enum `MotorcycleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MotorcycleStatus_new" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'IN_TRANSIT', 'OUT_OF_SERVICE');
ALTER TABLE "motorcycles" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "motorcycles" ALTER COLUMN "status" TYPE "MotorcycleStatus_new" USING ("status"::text::"MotorcycleStatus_new");
ALTER TYPE "MotorcycleStatus" RENAME TO "MotorcycleStatus_old";
ALTER TYPE "MotorcycleStatus_new" RENAME TO "MotorcycleStatus";
DROP TYPE "MotorcycleStatus_old";
ALTER TABLE "motorcycles" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
