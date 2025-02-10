import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { DealershipModule } from './dealership/dealership.module';
import { MotorcycleModule } from './motorcycle/motorcycle.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { MaintenanceNotificationModule } from './maintenance-notification/maintenance-notification.module';
import { SparePartModule } from './spare-part/spare-part.module';
import { SparePartOrderModule } from './spare-part-order/spare-part-order.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CompanyModule,
    DealershipModule,
    MotorcycleModule,
    MaintenanceModule,
    MaintenanceNotificationModule,
    SparePartModule,
    SparePartOrderModule,
  ],
})
export class AppModule {}
