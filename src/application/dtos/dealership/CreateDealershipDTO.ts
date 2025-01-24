import { UserRole } from "@domain/enums/UserRole";

export interface CreateDealershipDTO {
    userId: string;
    userRole: UserRole;      
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
}