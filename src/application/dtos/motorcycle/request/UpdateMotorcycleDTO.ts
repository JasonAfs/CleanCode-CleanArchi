import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export interface UpdateMotorcycleDTO extends BaseAuthenticatedDTO {
    motorcycleId: string;
    vin?: string;
    modelType?: MotorcycleModel;
    year?: number;
    color?: string;
    mileage?: number;
    dealershipId?: string;
}