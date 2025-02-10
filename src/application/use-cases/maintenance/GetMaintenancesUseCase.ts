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

    switch (user.role) {
      case UserRole.TRIUMPH_ADMIN:
        // L'admin peut tout voir
        return this.getMaintenances(dto);

      case UserRole.DEALERSHIP_MANAGER:
      case UserRole.DEALERSHIP_EMPLOYEE:
      case UserRole.DEALERSHIP_TECHNICIAN:
        if (!dto.dealershipId || user.dealershipId !== dto.dealershipId) {
          throw new UnauthorizedError(
            "Access denied to this dealership's maintenances",
          );
        }
        // Ne voir que les maintenances du dealership
        return this.getMaintenances({
          ...dto,
          dealershipId: user.dealershipId,
        });

      case UserRole.COMPANY_MANAGER:
      case UserRole.COMPANY_DRIVER:
        if (!dto.companyId || user.companyId !== dto.companyId) {
          throw new UnauthorizedError(
            "Access denied to this company's maintenances",
          );
        }
        // Ne voir que les maintenances des motos de la company
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
      await this.maintenanceRepository.findMaintenancesByFilters({
        startDate: dto.startDate || new Date(0),
        endDate: dto.endDate || new Date(),
        dealershipId: dto.dealershipId,
        companyId: dto.companyId,
        status: dto.status,
        type: dto.type,
        motorcycleId: dto.motorcycleId,
      });

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
