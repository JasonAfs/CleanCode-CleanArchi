import { IMaintenanceRepository } from '@application/ports/repositories/IMaintenanceRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { Maintenance } from '@domain/entities/MaintenanceEntity';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';

export class GetMaintenanceDetailsUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly dealershipRepository: IDealershipRepository,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(
    dto: GetMaintenanceDetailsDTO,
  ): Promise<MaintenanceDetailsResponseDTO> {
    // Vérification des autorisations
    if (
      ![
        UserRole.TRIUMPH_ADMIN,
        UserRole.DEALERSHIP_MANAGER,
        UserRole.COMPANY_MANAGER,
      ].includes(dto.userRole)
    ) {
      throw new UnauthorizedError(
        'You do not have permission to access maintenance details',
      );
    }

    const maintenance = await this.maintenanceRepository.findById(
      dto.maintenanceId,
    );

    if (!maintenance) {
      throw new Error('Maintenance not found');
    }

    // Vérification des autorisations spécifiques selon le rôle
    await this.verifyAccess(maintenance, dto);

    return this.toDTO(maintenance);
  }

  private async verifyAccess(
    maintenance: Maintenance,
    dto: GetMaintenanceDetailsDTO,
  ): Promise<void> {
    // TRIUMPH_ADMIN a accès à tout
    if (dto.userRole === UserRole.TRIUMPH_ADMIN) {
      return;
    }

    // DEALERSHIP_MANAGER ne peut voir que les maintenances de son dealership
    if (dto.userRole === UserRole.DEALERSHIP_MANAGER) {
      if (maintenance.dealershipId !== dto.userDealershipId) {
        throw new UnauthorizedError(
          'You can only access maintenances from your dealership',
        );
      }
      return;
    }

    // COMPANY_MANAGER ne peut voir que les maintenances des motos de sa company
    if (dto.userRole === UserRole.COMPANY_MANAGER) {
      const motorcycle = await this.getMotorcycleCompanyId(
        maintenance.motorcycleId,
      );
      if (motorcycle !== dto.userCompanyId) {
        throw new UnauthorizedError(
          "You can only access maintenances for your company's motorcycles",
        );
      }
    }
  }

  private async getMotorcycleCompanyId(
    motorcycleId: string,
  ): Promise<string | undefined> {
    const company =
      await this.companyRepository.findByMotorcycleId(motorcycleId);
    return company?.id;
  }

  private toDTO(maintenance: Maintenance): MaintenanceDetailsResponseDTO {
    return {
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
      spareParts: maintenance.getSpareParts().map((part) => ({
        reference: part.sparePartReference,
        name: part.sparePartName,
        quantity: part.quantity,
        unitPrice: part.unitPrice,
        totalPrice: part.totalPrice,
      })),
      costs: maintenance.getCosts() && {
        laborCost: maintenance.getCosts()!.maintenanceLaborCost,
        partsCost: maintenance.getCosts()!.maintenancePartsCost,
        total:
          maintenance.getCosts()!.maintenanceLaborCost +
          maintenance.getCosts()!.maintenancePartsCost,
      },
      recommendations: maintenance.getRecommendations().map((rec) => ({
        description: rec.description,
        priority: rec.priority,
      })),
      warranty: maintenance.getWarranty() && {
        type: maintenance.getWarranty()!.type,
        startDate: maintenance.getWarranty()!.startDate,
        endDate: maintenance.getWarranty()!.endDate,
      },
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt,
    };
  }
}

export interface GetMaintenanceDetailsDTO {
  maintenanceId: string;
  userId: string;
  userRole: UserRole;
  userDealershipId?: string;
  userCompanyId?: string;
}

export interface MaintenanceDetailsResponseDTO {
  id: string;
  motorcycleId: string;
  dealershipId: string;
  type: string;
  status: string;
  description: string;
  mileage: number;
  scheduledDate: Date;
  startDate?: Date;
  completedDate?: Date;
  spareParts: {
    reference: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  costs?: {
    laborCost: number;
    partsCost: number;
    total: number;
  };
  recommendations: {
    description: string;
    priority: string;
  }[];
  warranty?: {
    type: string;
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
