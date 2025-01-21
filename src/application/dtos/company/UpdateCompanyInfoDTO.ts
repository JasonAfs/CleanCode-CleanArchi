import { UserRole } from "@domain/enums/UserRole";

export interface UpdateCompanyInfoDTO {
    userId: string;
    userRole: UserRole;
    dealershipId?: string;
    companyId: string;
    name?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
}