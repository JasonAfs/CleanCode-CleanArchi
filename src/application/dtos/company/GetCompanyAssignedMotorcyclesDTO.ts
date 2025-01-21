import { UserRole } from "@domain/enums/UserRole";

export interface GetCompanyAssignedMotorcyclesDTO {
    userId: string;
    userRole: UserRole;
    dealershipId?: string;
    companyId: string;
    includeInactive?: boolean;
}