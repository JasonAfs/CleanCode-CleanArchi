import { AssignMotorcycleToCompanyDTO } from '@application/dtos/motorcycle/request/AssignMotorcycleToCompanyDTO';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { UserRole } from '@domain/enums/UserRole';

export class AssignMotorcycleToCompanyValidator {
    public validate(dto: AssignMotorcycleToCompanyDTO): void {
        // Vérification des rôles autorisés
        if (![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(dto.userRole)) {
            throw new MotorcycleValidationError(
                'Only TRIUMPH_ADMIN or DEALERSHIP_MANAGER can assign motorcycles to companies'
            );
        }

        // Pour les managers de concession, le dealershipId est requis
        if (dto.userRole === UserRole.DEALERSHIP_MANAGER && !dto.dealershipId?.trim()) {
            throw new MotorcycleValidationError('Dealership ID is required for dealership managers');
        }

        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError('Motorcycle ID is required');
        }

        if (!dto.companyId?.trim()) {
            throw new MotorcycleValidationError('Company ID is required');
        }
    }
}