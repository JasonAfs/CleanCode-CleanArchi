import { TransferMotorcycleBetweenCompaniesDTO } from '@application/dtos/motorcycle/request/TransferMotorcycleBetweenCompaniesDTO';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { UserRole } from '@domain/enums/UserRole';

export class TransferMotorcycleBetweenCompaniesValidator {
  public validate(dto: TransferMotorcycleBetweenCompaniesDTO): void {
    // Vérification des rôles autorisés
    if (
      ![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(
        dto.userRole,
      )
    ) {
      throw new MotorcycleValidationError(
        'Only TRIUMPH_ADMIN or DEALERSHIP_MANAGER can transfer motorcycles between companies',
      );
    }

    // Pour les managers de concession, le dealershipId est requis
    if (
      dto.userRole === UserRole.DEALERSHIP_MANAGER &&
      !dto.dealershipId?.trim()
    ) {
      throw new MotorcycleValidationError(
        'Dealership ID is required for dealership managers',
      );
    }

    if (!dto.motorcycleId?.trim()) {
      throw new MotorcycleValidationError('Motorcycle ID is required');
    }

    if (!dto.targetCompanyId?.trim()) {
      throw new MotorcycleValidationError('Target company ID is required');
    }
  }
}
