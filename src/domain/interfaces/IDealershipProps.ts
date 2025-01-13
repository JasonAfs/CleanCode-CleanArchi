// src/domain/interfaces/IDealershipProps.ts
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { DealershipEmployees } from "@domain/aggregates/dealership/DealershipEmployees";

export interface IDealershipProps {
    id: string;
    name: string;
    address: Address;
    contactInfo: ContactInfo;
    employees: DealershipEmployees;  
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}