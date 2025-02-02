import { AddCompanyEmployeeDTO } from '@application/dtos/company/request/AddCompanyEmployeeDTO';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';

export class AddCompanyEmployeeValidator {
    public validate(dto: AddCompanyEmployeeDTO): void {
        if (!dto.companyId?.trim()) {
            throw new CompanyValidationError('Company ID is required');
        }

        if (!dto.employeeId?.trim()) {
            throw new CompanyValidationError('Employee ID is required');
        }

        if (!dto.role) {
            throw new CompanyValidationError('Role is required');
        }
    }
}