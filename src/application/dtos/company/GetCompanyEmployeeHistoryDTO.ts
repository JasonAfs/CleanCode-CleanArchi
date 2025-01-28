import { BaseAuthenticatedDTO } from "../shared/BaseAuthenticatedDTO";

export interface GetCompanyEmployeeHistoryDTO extends BaseAuthenticatedDTO{
    dealershipId?: string;
    companyId: string;
    includeInactive?: boolean;
}