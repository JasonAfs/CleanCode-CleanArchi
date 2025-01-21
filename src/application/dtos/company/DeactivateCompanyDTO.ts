import { UserRole } from "@domain/enums/UserRole";

export interface DeactivateCompanyDTO {
    userId: string;
    userRole: UserRole;
    dealershipId?: string;
    companyId: string;
}
