import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { DealershipModule } from './dealership/dealership.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CompanyModule,
    DealershipModule,
  ],
})
export class AppModule {}