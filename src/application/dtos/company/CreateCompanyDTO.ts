export interface CreateCompanyDTO {
    name: string;
    registrationNumber: string; // SIRET
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
}