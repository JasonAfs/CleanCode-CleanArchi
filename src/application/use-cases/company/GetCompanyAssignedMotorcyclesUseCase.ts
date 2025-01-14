import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { GetCompanyAssignedMotorcyclesDTO } from "@application/dtos/company/GetCompanyAssignedMotorcyclesDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { Motorcycle } from "@domain/entities/MotorcycleEntity";

export class GetCompanyAssignedMotorcyclesUseCase {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly motorcycleRepository: IMotorcycleRepository
    ) {}

    public async execute(dto: GetCompanyAssignedMotorcyclesDTO): Promise<Motorcycle[]> {
        // Verify company exists
        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        // Get assignments
        let assignments;
        if (dto.includeInactive) {
            assignments = await this.companyMotorcycleRepository.findByCompanyId(dto.companyId);
        } else {
            assignments = await this.companyMotorcycleRepository.findActiveByCompanyId(dto.companyId);
        }

        // Get motorcycles for each assignment
        const motorcycles = await Promise.all(
            assignments.map(assignment => 
                this.motorcycleRepository.findById(assignment.motorcycleId)
            )
        );

        // Filter out any null values (in case a motorcycle was deleted)
        return motorcycles.filter((motorcycle): motorcycle is Motorcycle => motorcycle !== null);
    }
}