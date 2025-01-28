import { BaseAuthenticatedDTO } from "../shared/BaseAuthenticatedDTO";

export interface GetDealershipsDTO extends BaseAuthenticatedDTO {
    includeInactive?: boolean;
}