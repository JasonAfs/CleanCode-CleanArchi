// application/dtos/company/CreateCompanyDTO.ts
import { UserRole } from "@domain/enums/UserRole";

export interface CreateCompanyDTO {
    // Informations d'authentification
    userId: string;
    userRole: UserRole;
    dealershipId?: string;  // Ajout de dealershipId comme optionnel
    
    // Données métier
    name: string;
    registrationNumber: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
}