// src/application/validation/motorcycle/TransferMotorcycleValidator.ts
import { TransferMotorcycleToDealershipDTO } from '@application/dtos/motorcycle/request/TransferMotorcycleToDealershipDTO';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { UserRole } from '@domain/enums/UserRole';

export class TransferMotorcycleValidator {
    public validate(dto: TransferMotorcycleToDealershipDTO): void {
        if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
            throw new MotorcycleValidationError('Only TRIUMPH_ADMIN can transfer motorcycles');
        }

        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError('Motorcycle ID is required');
        }

        if (!dto.targetDealershipId?.trim()) {
            throw new MotorcycleValidationError('Target dealership ID is required');
        }

        if (dto.targetDealershipId === dto.userDealershipId) {
            throw new MotorcycleValidationError('Cannot transfer motorcycle to the same dealership');
        }
    }
}