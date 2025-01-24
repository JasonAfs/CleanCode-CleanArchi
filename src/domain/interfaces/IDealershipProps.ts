// src/domain/interfaces/IDealershipProps.ts
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { DealershipEmployees } from "@domain/aggregates/dealership/DealershipEmployees";
import { Motorcycle } from "@domain/entities/MotorcycleEntity";

export interface IDealershipProps {
    id: string;
    name: string;
    address: Address;
    contactInfo: ContactInfo;
    employees: DealershipEmployees;
    motorcycles: Motorcycle[]; // Ajout de la propriété motorcycles
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}