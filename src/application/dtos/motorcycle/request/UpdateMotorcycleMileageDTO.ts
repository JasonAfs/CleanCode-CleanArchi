import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface UpdateMotorcycleMileageDTO extends BaseAuthenticatedDTO {
  motorcycleId: string;
  mileage: number;
}
