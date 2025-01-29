import { GetDealershipsDTO } from '@application/dtos/dealership/request/GetDealershipsDTO';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class GetDealershipsValidator {
    public validate(dto: GetDealershipsDTO): void {
        if (!dto.userId?.trim()) {
            throw new DealershipValidationError('User ID is required');
        }
    }
}