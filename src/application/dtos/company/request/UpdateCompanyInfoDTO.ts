import { BaseAuthenticatedDTO } from "../../shared/BaseAuthenticatedDTO";

export interface UpdateCompanyInfoDTO extends BaseAuthenticatedDTO {
    dealershipId?: string;
    companyId: string;
    name?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
}