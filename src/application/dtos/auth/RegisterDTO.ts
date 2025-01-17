import { UserRole } from "@domain/enums/UserRole";

export interface RegisterDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyId?: string;
    dealershipId?: string;
}