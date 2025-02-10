import { IMaintenanceNotificationRepository } from '@application/ports/repositories/IMaintenanceNotificationRepository';
import { GetMaintenanceNotificationsDTO } from '@application/dtos/maintenance/request/GetMaintenanceNotificationsDTO';
import { MaintenanceNotificationResponseDTO } from '@application/dtos/maintenance/response/MaintenanceNotificationResponseDTO';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotificationEntity';

export class GetMaintenanceNotificationsUseCase {
  constructor(
    private readonly maintenanceNotificationRepository: IMaintenanceNotificationRepository,
  ) {}

  private validateAuthorization(dto: GetMaintenanceNotificationsDTO): void {
    const authorizedRoles = [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.COMPANY_MANAGER,
    ];

    if (!authorizedRoles.includes(dto.userRole)) {
      throw new UnauthorizedError(
        'User role not authorized to access notifications',
      );
    }

    if (dto.userRole === UserRole.DEALERSHIP_MANAGER && !dto.dealershipId) {
      throw new UnauthorizedError(
        'Dealership ID is required for dealership manager',
      );
    }

    if (dto.userRole === UserRole.COMPANY_MANAGER && !dto.companyId) {
      throw new UnauthorizedError('Company ID is required for company manager');
    }
  }

  async execute(
    dto: GetMaintenanceNotificationsDTO,
  ): Promise<MaintenanceNotificationResponseDTO[]> {
    // Vérification des autorisations
    this.validateAuthorization(dto);

    let notifications: MaintenanceNotification[];

    switch (dto.userRole) {
      case UserRole.TRIUMPH_ADMIN:
        notifications = await this.maintenanceNotificationRepository.findAll();
        break;

      case UserRole.DEALERSHIP_MANAGER:
        notifications =
          await this.maintenanceNotificationRepository.findByDealershipId(
            dto.dealershipId!,
          );
        break;

      case UserRole.COMPANY_MANAGER:
        notifications =
          await this.maintenanceNotificationRepository.findByCompanyId(
            dto.companyId!,
          );
        break;

      default:
        throw new UnauthorizedError('Unauthorized role');
    }

    // Filtrer les notifications lues si demandé
    if (!dto.includeRead) {
      notifications = notifications.filter(
        (notification) => !notification.isRead,
      );
    }

    // Transformer en DTO de réponse
    return notifications.map((notification) => ({
      id: notification.id,
      motorcycleId: notification.motorcycleId,
      dealershipId: notification.dealershipId,
      companyId: notification.companyId,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    }));
  }
}
