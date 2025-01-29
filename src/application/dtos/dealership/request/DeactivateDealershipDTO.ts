import { BaseAuthenticatedDTO } from "../../shared/BaseAuthenticatedDTO";

export interface DeactivateDealershipDTO extends BaseAuthenticatedDTO{
    dealershipId: string;
}