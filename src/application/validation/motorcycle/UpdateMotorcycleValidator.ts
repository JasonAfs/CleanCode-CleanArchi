import { UpdateMotorcycleDTO } from "@application/dtos/motorcycle/request/UpdateMotorcycleDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";
import { UserRole } from "@domain/enums/UserRole";

export class UpdateMotorcycleValidator {
    public validate(dto: UpdateMotorcycleDTO): void {
        if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
            throw new MotorcycleValidationError('Only TRIUMPH_ADMIN can update motorcycles');
        }

        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError('Motorcycle ID is required');
        }

        if (dto.vin !== undefined && !dto.vin.trim()) {
            throw new MotorcycleValidationError('VIN cannot be empty');
        }

        if (dto.color !== undefined && !dto.color.trim()) {
            throw new MotorcycleValidationError('Color cannot be empty');
        }

        if (dto.mileage !== undefined && (typeof dto.mileage !== 'number' || dto.mileage < 0)) {
            throw new MotorcycleValidationError('Invalid mileage value');
        }

        if (dto.dealershipId !== undefined && !dto.dealershipId.trim()) {
            throw new MotorcycleValidationError('Dealership ID cannot be empty');
        }
    }
}