import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface CreateCompanyDTO extends BaseAuthenticatedDTO {
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
