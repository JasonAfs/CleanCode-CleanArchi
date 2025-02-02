import { RemoveCompanyEmployeeDTO } from '@application/dtos/company/request/RemoveCompanyEmployeeDTO';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';

export class RemoveCompanyEmployeeValidator {
    public validate(dto: RemoveCompanyEmployeeDTO): void {
        if (!dto.companyId?.trim()) {
            throw new CompanyValidationError('Company ID is required');
        }

        if (!dto.employeeId?.trim()) {
            throw new CompanyValidationError('Employee ID is required');
        }
    }
}