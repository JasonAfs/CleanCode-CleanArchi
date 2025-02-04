import { UserRole } from "@domain/enums/UserRole";

export interface BaseAuthenticatedDTO {
    userId: string;
    userRole: UserRole;
    userDealershipId?: string;
    userCompanyId?: string;
}