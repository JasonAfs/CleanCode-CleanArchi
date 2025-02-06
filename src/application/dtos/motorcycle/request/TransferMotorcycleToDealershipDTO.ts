import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface TransferMotorcycleToDealershipDTO extends BaseAuthenticatedDTO {
    motorcycleId: string;
    targetDealershipId: string;
}