import { IMaintenanceRepository } from '@application/ports/repositories/IMaintenanceRepository';
import { GetMaintenancesDTO } from '@application/dtos/maintenance/request/GetMaintenancesDTO';
import { MaintenanceResponseDTO } from '@application/dtos/maintenance/response/MaintenanceResponseDTO';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';

export class GetMaintenancesUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: GetMaintenancesDTO): Promise<MaintenanceResponseDTO[]> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Vérification des autorisations selon le rôle
    switch (user.role) {
      case UserRole.TRIUMPH_ADMIN:
        // Admin peut tout voir, pas de filtres supplémentaires nécessaires
        return this.getMaintenances(dto);

      case UserRole.DEALERSHIP_MANAGER:
      case UserRole.DEALERSHIP_EMPLOYEE:
      case UserRole.DEALERSHIP_TECHNICIAN:
        // Vérifie que l'utilisateur appartient bien au dealership demandé
        if (!dto.dealershipId || user.dealershipId !== dto.dealershipId) {
          throw new UnauthorizedError(
            "Access denied to this dealership's maintenances",
          );
        }
        return this.getMaintenances({
          ...dto,
          dealershipId: user.dealershipId,
        });

      case UserRole.COMPANY_MANAGER:
      case UserRole.COMPANY_DRIVER:
        // Vérifie que l'utilisateur appartient bien à la company demandée
        if (!dto.companyId || user.companyId !== dto.companyId) {
          throw new UnauthorizedError(
            "Access denied to this company's maintenances",
          );
        }
        return this.getMaintenances({
          ...dto,
          companyId: user.companyId,
        });

      default:
        throw new UnauthorizedError('Role not authorized to view maintenances');
    }
  }

  private async getMaintenances(
    dto: GetMaintenancesDTO,
  ): Promise<MaintenanceResponseDTO[]> {
    let maintenances =
      await this.maintenanceRepository.findMaintenancesByDateRange(
        dto.startDate || new Date(0),
        dto.endDate || new Date(),
        dto.dealershipId,
      );

    // Applique les filtres supplémentaires
    if (dto.status) {
      maintenances = maintenances.filter((m) => m.status === dto.status);
    }

    if (dto.type) {
      maintenances = maintenances.filter((m) => m.type === dto.type);
    }

    if (dto.motorcycleId) {
      maintenances = maintenances.filter(
        (m) => m.motorcycleId === dto.motorcycleId,
      );
    }

    // Transforme les entités en DTO
    return maintenances.map((maintenance) => ({
      id: maintenance.id,
      motorcycleId: maintenance.motorcycleId,
      dealershipId: maintenance.dealershipId,
      type: maintenance.type,
      status: maintenance.status,
      description: maintenance.description,
      mileage: maintenance.mileage,
      scheduledDate: maintenance.scheduledDate,
      startDate: maintenance.startDate,
      completedDate: maintenance.completedDate,
      spareParts: maintenance.getSpareParts(),
      costs: maintenance.getCosts(),
      recommendations: maintenance.getRecommendations(),
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt,
    }));
  }
}
