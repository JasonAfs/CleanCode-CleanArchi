import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CompanyModule,
  ],
})
export class AppModule {}