import { BaseAuthenticatedDTO } from "../shared/BaseAuthenticatedDTO";
export interface DeactivateCompanyDTO extends BaseAuthenticatedDTO{
    dealershipId?: string;
    companyId: string;
}
