import { BaseAuthenticatedDTO } from "../../shared/BaseAuthenticatedDTO";

export interface GetCompaniesDTO extends BaseAuthenticatedDTO {
    includeInactive?: boolean;
}