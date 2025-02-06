import { CreateMotorcycleDTO } from "@application/dtos/motorcycle/request/CreateMotorcycleDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";
import { UserRole } from "@domain/enums/UserRole";

export class CreateMotorcycleValidator {
    public validate(dto: CreateMotorcycleDTO): void {
        if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
            throw new MotorcycleValidationError('Only TRIUMPH_ADMIN can create motorcycles');
        }

        if (!dto.vin?.trim()) {
            throw new MotorcycleValidationError('VIN is required');
        }

        if (!dto.modelType) {
            throw new MotorcycleValidationError('Model type is required');
        }

        if (!dto.year) {
            throw new MotorcycleValidationError('Year is required');
        }

        if (!dto.color?.trim()) {
            throw new MotorcycleValidationError('Color is required');
        }

        if (typeof dto.mileage !== 'number' || dto.mileage < 0) {
            throw new MotorcycleValidationError('Valid mileage is required');
        }

        if (!dto.dealershipId?.trim()) {
            throw new MotorcycleValidationError('Dealership ID is required');
        }
    }
}