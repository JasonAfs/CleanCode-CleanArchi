import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { CreateMotorcycleDTO } from "@application/dtos/motorcycle/CreateMotorcycleDTO";
import { CreateMotorcycleValidator } from "@application/validation/motorcycle/CreateMotorcycleValidator";
import { Motorcycle } from "@domain/entities/MotorcycleEntity";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";

export class CreateMotorcycleUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly dealershipRepository: IDealershipRepository,
        private readonly validator: CreateMotorcycleValidator
    ) {}

    public async execute(dto: CreateMotorcycleDTO): Promise<Motorcycle> {
        // Validate input
        this.validator.validate(dto);

        // Check if dealership exists
        const dealership = await this.dealershipRepository.findById(dto.dealershipId);
        if (!dealership) {
            throw new DealershipNotFoundError(dto.dealershipId);
        }

        // Check if motorcycle with VIN already exists
        const exists = await this.motorcycleRepository.exists(dto.vin);
        if (exists) {
            throw new Error(`Motorcycle with VIN ${dto.vin} already exists`);
        }

        // Create motorcycle entity
        const motorcycle = Motorcycle.create({
            vin: dto.vin,
            dealershipId: dto.dealershipId,
            model: dto.model,
            year: dto.year,
            registrationNumber: dto.registrationNumber,
            mileage: dto.mileage
        });

        // Save to repository
        await this.motorcycleRepository.create(motorcycle);

        return motorcycle;
    }
}