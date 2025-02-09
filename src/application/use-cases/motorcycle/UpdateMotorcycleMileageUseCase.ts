import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { IMaintenanceRepository } from '@application/ports/repositories/IMaintenanceRepository';
import { IMaintenanceNotificationRepository } from '@application/ports/repositories/IMaintenanceNotificationRepository';
import { UpdateMotorcycleMileageDTO } from '@application/dtos/motorcycle/request/UpdateMotorcycleMileageDTO';
import { UpdateMotorcycleMileageValidator } from '@application/validation/motorcycle/UpdateMotorcycleMileageValidator';
import { Result } from '@domain/shared/Result';
import { MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UpdateMotorcycleMileageResponseDTO } from '@application/dtos/motorcycle/response/UpdateMotorcycleMileageResponseDTO';
import { UserRole } from '@domain/enums/UserRole';
import { MaintenanceType } from '@domain/enums/MaintenanceEnums';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotificationEntity';

export class UpdateMotorcycleMileageUseCase {
  private readonly validator = new UpdateMotorcycleMileageValidator();

  constructor(
    private readonly motorcycleRepository: IMotorcycleRepository,
    private readonly dealershipRepository: IDealershipRepository,
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly notificationRepository: IMaintenanceNotificationRepository,
  ) {}

  public async execute(
    dto: UpdateMotorcycleMileageDTO,
  ): Promise<Result<UpdateMotorcycleMileageResponseDTO, Error>> {
    try {
      try {
        this.validator.validate(dto);
      } catch (error) {
        if (error instanceof Error) {
          return error;
        }
        throw error;
      }

      // 2. Récupération de la moto
      const motorcycle = await this.motorcycleRepository.findById(
        dto.motorcycleId,
      );
      if (!motorcycle) {
        return new MotorcycleNotFoundError(dto.motorcycleId);
      }
      // 3. Vérification que l'employé appartient à la bonne concession ou société
      if (
        dto.userRole !== UserRole.TRIUMPH_ADMIN &&
        dto.userRole !== UserRole.COMPANY_MANAGER &&
        (!motorcycle.dealershipId ||
          motorcycle.dealershipId !== dto.userDealershipId)
      ) {
        return new UnauthorizedError(
          "You don't have access to update this motorcycle's mileage",
        );
      }

      // Si c'est un COMPANY_MANAGER, vérifier qu'il appartient à la même société que la moto
      if (
        dto.userRole === UserRole.COMPANY_MANAGER &&
        motorcycle.companyId !== dto.userCompanyId
      ) {
        return new UnauthorizedError(
          "You don't have access to update this motorcycle's mileage",
        );
      }

      const previousMileage = motorcycle.mileage;
      // 4. Mise à jour du kilométrage
      try {
        motorcycle.updateMileage(dto.mileage);
      } catch (error) {
        if (error instanceof Error) {
          return error;
        }
        throw error;
      }
      console.log('motorcycle.isMaintenanceNeeded() = ' + motorcycle.isMaintenanceNeeded());
      // Vérifier si une maintenance est nécessaire
      if (motorcycle.isMaintenanceNeeded()) {
        // Créer la maintenance
        const nextDue = motorcycle.getNextMaintenanceDue();
        const maintenance = motorcycle.planMaintenance(
          motorcycle.dealershipId!,
          nextDue.dueDate,
          `Maintenance préventive - Intervalle ${motorcycle.model.getType()} atteint`,
          MaintenanceType.PREVENTIVE,
        );

        // Créer la notification
        const notification = MaintenanceNotification.create(
          motorcycle.id,
          motorcycle.dealershipId!,
          `Maintenance requise pour la moto ${motorcycle.vin.toString()}. 
           Kilométrage actuel: ${motorcycle.mileage}km.`,
          motorcycle.companyId,
        );

        // Sauvegarder
        await this.maintenanceRepository.create(maintenance);
        await this.notificationRepository.create(notification);
      }

      // 5. Persistence
      await this.motorcycleRepository.updateMileage(motorcycle.id, dto.mileage);

      // 6. Retour de la réponse
      return {
        success: true,
        message: `Motorcycle mileage has been successfully updated`,
        motorcycleId: motorcycle.id,
        previousMileage: previousMileage,
        newMileage: dto.mileage,
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while updating motorcycle mileaxge',
      );
    }
  }
}
