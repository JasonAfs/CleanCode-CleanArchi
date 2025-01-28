import { BaseAuthenticatedDTO } from "../shared/BaseAuthenticatedDTO";

export interface GetCompanyAssignedMotorcyclesDTO extends BaseAuthenticatedDTO{
    dealershipId?: string;
    companyId: string;
    includeInactive?: boolean;
}