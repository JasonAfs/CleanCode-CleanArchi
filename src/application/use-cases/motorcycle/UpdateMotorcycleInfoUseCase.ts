import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { UpdateMotorcycleInfoDTO } from "@application/dtos/motorcycle/UpdateMotorcycleInfoDTO";
import { UpdateMotorcycleInfoValidator } from "@application/validation/motorcycle/UpdateMotorcycleInfoValidator";
import { MotorcycleNotFoundError } from "@domain/errors/motorcycle/MotorcycleNotFoundError";

export class UpdateMotorcycleInfoUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly validator: UpdateMotorcycleInfoValidator
    ) {}

    public async execute(dto: UpdateMotorcycleInfoDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get motorcycle
        const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
        if (!motorcycle) {
            throw new MotorcycleNotFoundError(dto.motorcycleId);
        }

        // Update mileage if provided
        if (dto.mileage !== undefined) {
            motorcycle.updateMileage(dto.mileage);
        }

        // Save changes
        await this.motorcycleRepository.update(motorcycle);
    }
}