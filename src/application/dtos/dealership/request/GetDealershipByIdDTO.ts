import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface GetDealershipByIdDTO extends BaseAuthenticatedDTO {
  dealershipId: string;
}
