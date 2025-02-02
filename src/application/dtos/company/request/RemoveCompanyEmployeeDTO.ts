import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface RemoveCompanyEmployeeDTO extends BaseAuthenticatedDTO {
    companyId: string;
    employeeId: string;
    dealershipId?: string;
}