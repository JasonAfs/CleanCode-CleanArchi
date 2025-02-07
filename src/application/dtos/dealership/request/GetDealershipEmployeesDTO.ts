import { BaseAuthenticatedDTO } from "../../shared/BaseAuthenticatedDTO";
import { UserRole } from "@domain/enums/UserRole";

export interface GetDealershipEmployeesDTO extends BaseAuthenticatedDTO {
    dealershipId: string;
    includeInactive?: boolean;
    roleFilter?: UserRole;
}