import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { GetCompanyEmployeeHistoryDTO } from "@application/dtos/company/GetCompanyEmployeeHistoryDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { User } from "@domain/entities/UserEntity";

export class GetCompanyEmployeeHistoryUseCase {
    constructor(
        private readonly companyRepository: ICompanyRepository
    ) {}

    public async execute(dto: GetCompanyEmployeeHistoryDTO): Promise<User[]> {
        // Verify company exists
        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        // Get all employees
        if (dto.includeInactive) {
            return company.employees.getAll();
        }
        
        // Filter active employees
        return company.employees.getAll().filter(employee => employee.isActive);
    }
}