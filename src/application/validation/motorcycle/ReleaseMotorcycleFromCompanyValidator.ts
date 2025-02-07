import { ReleaseMotorcycleFromCompanyDTO } from '@application/dtos/motorcycle/request/ReleaseMotorcycleFromCompanyDTO';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { UserRole } from '@domain/enums/UserRole';

export class ReleaseMotorcycleFromCompanyValidator {
    public validate(dto: ReleaseMotorcycleFromCompanyDTO): void {
        // Vérification des rôles autorisés
        if (![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(dto.userRole)) {
            throw new MotorcycleValidationError(
                'Only TRIUMPH_ADMIN or DEALERSHIP_MANAGER can release motorcycles from companies'
            );
        }

        // Pour les managers de concession, le dealershipId est requis
        if (dto.userRole === UserRole.DEALERSHIP_MANAGER && !dto.dealershipId?.trim()) {
            throw new MotorcycleValidationError('Dealership ID is required for dealership managers');
        }

        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError('Motorcycle ID is required');
        }
    }
}