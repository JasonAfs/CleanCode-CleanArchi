import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface UpdateDealershipInfoDTO extends BaseAuthenticatedDTO {
  dealershipId: string;
  name?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
}
