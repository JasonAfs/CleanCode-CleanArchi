import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';
import { CompanyEmployees } from '@domain/aggregates/company/CompanyEmployees';
import { CompanyMotorcycles } from '@domain/aggregates/company/CompanyMotorcycles';

export interface CompanyProps {
  id: string;
  name: string;
  registrationNumber: RegistrationNumber;
  address: Address;
  contactInfo: ContactInfo;
  employees: CompanyEmployees;
  motorcycles: CompanyMotorcycles;
  createdByDealershipId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyProps {
  name: string;
  registrationNumber: RegistrationNumber;
  address: Address;
  contactInfo: ContactInfo;
  createdByDealershipId?: string;
}

export interface ReconstitueCompanyProps extends CreateCompanyProps {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
