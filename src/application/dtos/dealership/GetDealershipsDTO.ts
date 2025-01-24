import { UserRole } from "@domain/enums/UserRole";

export interface GetDealershipsDTO {
    userId: string;
    userRole: UserRole;
    includeInactive?: boolean;
}