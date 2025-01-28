import { BaseAuthenticatedDTO } from "../shared/BaseAuthenticatedDTO";

export interface RemoveDealershipEmployeeDTO extends BaseAuthenticatedDTO {
    dealershipId: string;
    employeeId: string;
}