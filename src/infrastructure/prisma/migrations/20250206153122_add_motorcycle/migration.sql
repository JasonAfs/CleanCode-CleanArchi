-- CreateEnum
CREATE TYPE "MotorcycleStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'IN_MAINTENANCE', 'IN_TRANSIT', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "MotorcycleModel" AS ENUM ('STREET_TRIPLE_765_RS', 'TIGER_900_RALLY_PRO', 'SPEED_TRIPLE_1200_RS', 'TRIDENT_660', 'ROCKET_3_GT', 'BONNEVILLE_T120', 'TIGER_1200_GT_EXPLORER', 'SCRAMBLER_1200_XE');

-- CreateTable
CREATE TABLE "motorcycles" (
    "id" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "modelType" "MotorcycleModel" NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "status" "MotorcycleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dealershipId" TEXT,
    "companyId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motorcycles_vin_key" ON "motorcycles"("vin");

-- AddForeignKey
ALTER TABLE "motorcycles" ADD CONSTRAINT "motorcycles_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "dealerships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorcycles" ADD CONSTRAINT "motorcycles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
