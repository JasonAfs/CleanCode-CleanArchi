import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export interface CreateMotorcycleDTO extends BaseAuthenticatedDTO {
    vin: string;
    modelType: MotorcycleModel;
    year: number;
    color: string;
    mileage: number;
    dealershipId: string;
}