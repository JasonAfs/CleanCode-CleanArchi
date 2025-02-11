import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface ReleaseMotorcycleFromCompanyDTO extends BaseAuthenticatedDTO {
  motorcycleId: string;
  dealershipId?: string;
}
