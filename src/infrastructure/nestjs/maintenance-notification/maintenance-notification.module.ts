import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MaintenanceNotificationController } from './controllers/maintenance-notification.controller';
import { GetMaintenanceNotificationsUseCase } from '@application/use-cases/maintenance/GetMaintenanceNotificationsUseCase';
import { IMaintenanceNotificationRepository } from '@application/ports/repositories/IMaintenanceNotificationRepository';
import { PrismaMaintenanceNotificationRepository } from '@infrastructure/repositories/prisma/PrismaMaintenanceNotificationRepository';

@Module({
  imports: [PrismaModule],
  controllers: [MaintenanceNotificationController],
  providers: [
    {
      provide: 'IMaintenanceNotificationRepository',
      useFactory: (prisma: PrismaService) => {
        return new PrismaMaintenanceNotificationRepository(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: GetMaintenanceNotificationsUseCase,
      useFactory: (repo: IMaintenanceNotificationRepository) => {
        return new GetMaintenanceNotificationsUseCase(repo);
      },
      inject: ['IMaintenanceNotificationRepository'],
    },
  ],
})
export class MaintenanceNotificationModule {}
