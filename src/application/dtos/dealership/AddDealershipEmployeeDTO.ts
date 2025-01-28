import { UserRole } from "@domain/enums/UserRole";
import { BaseAuthenticatedDTO } from "../shared/BaseAuthenticatedDTO";

export interface AddDealershipEmployeeDTO extends BaseAuthenticatedDTO {
    dealershipId: string;
    employeeId: string;
    role: UserRole;
}

