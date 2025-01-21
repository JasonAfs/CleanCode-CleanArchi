import { UserRole } from "@domain/enums/UserRole";

export interface GetCompanyEmployeeHistoryDTO {
    userId: string;
    userRole: UserRole;
    dealershipId?: string;
    companyId: string;
    includeInactive?: boolean;
}