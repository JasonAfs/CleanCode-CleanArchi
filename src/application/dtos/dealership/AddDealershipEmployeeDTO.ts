import { UserRole } from "@domain/enums/UserRole";

export interface AddDealershipEmployeeDTO {
    dealershipId: string;
    employeeId: string;
    role: UserRole;
}