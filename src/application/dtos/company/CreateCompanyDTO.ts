import { UserRole } from "@domain/enums/UserRole";

export interface CreateCompanyDTO {
    userId: string;
    userRole: UserRole;
    dealershipId?: string;
    name: string;
    registrationNumber: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
}