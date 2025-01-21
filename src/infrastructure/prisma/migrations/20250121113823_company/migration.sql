-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "createdByDealershipId" TEXT;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_createdByDealershipId_fkey" FOREIGN KEY ("createdByDealershipId") REFERENCES "dealerships"("id") ON DELETE SET NULL ON UPDATE CASCADE;
