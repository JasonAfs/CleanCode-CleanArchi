import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface AssignMotorcycleToCompanyDTO extends BaseAuthenticatedDTO {
    motorcycleId: string;
    companyId: string;
    dealershipId?: string;
}