import { UpdateMotorcycleMileageDTO } from '@application/dtos/motorcycle/request/UpdateMotorcycleMileageDTO';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { ROLE_PERMISSIONS } from '@domain/services/authorization/PermissionRegistry';
import { Permission } from '@domain/services/authorization/Permission';

export class UpdateMotorcycleMileageValidator {
    public validate(dto: UpdateMotorcycleMileageDTO): void {
        const userPermissions = ROLE_PERMISSIONS.get(dto.userRole);
        if (!userPermissions?.has(Permission.UPDATE_MOTORCYCLE_MILEAGE)) {
            throw new MotorcycleValidationError('User does not have permission to update motorcycle mileage');
        }

        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError('Motorcycle ID is required');
        }

        if (typeof dto.mileage !== 'number' || dto.mileage < 0) {
            throw new MotorcycleValidationError('Valid mileage value is required');
        }
    }
}