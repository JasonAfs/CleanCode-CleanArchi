import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { RegistrationNumber } from "@domain/value-objects/RegistrationNumber";
import { CompanyEmployees } from "@domain/aggregates/company/CompanyEmployees";

export interface ICompanyProps {
    id: string;
    name: string;
    registrationNumber: RegistrationNumber;
    address: Address;
    contactInfo: ContactInfo;
    employees: CompanyEmployees;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}