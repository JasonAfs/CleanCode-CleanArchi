import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface CreateDealershipDTO extends BaseAuthenticatedDTO {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}
