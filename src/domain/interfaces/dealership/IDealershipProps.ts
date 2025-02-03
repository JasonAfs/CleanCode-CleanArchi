import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { DealershipEmployees } from '@domain/aggregates/dealership/DealershipEmployees';
import { DealershipMotorcycles } from '@domain/aggregates/dealership/DealershipMotorcycles';

export interface DealershipProps {
    id: string;
    name: string;
    address: Address;
    contactInfo: ContactInfo;
    employees: DealershipEmployees;
    motorcycles: DealershipMotorcycles; // Changé de Motorcycle[] à DealershipMotorcycles
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDealershipProps {
    name: string;
    address: Address;
    contactInfo: ContactInfo;
}

export interface ReconstituteDealershipProps extends CreateDealershipProps {
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}