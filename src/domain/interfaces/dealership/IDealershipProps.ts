import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { DealershipEmployees } from '@domain/aggregates/dealership/DealershipEmployees';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';

export interface DealershipProps {
  id: string;
  name: string;
  address: Address;
  contactInfo: ContactInfo;
  employees: DealershipEmployees;
  motorcycles: Motorcycle[]; //TODO : à modifier avec l'aggregate
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
