import { GetDealershipByIdUseCaseDTO } from '@application/use-cases/dealership/GetDealershipByIdUseCase';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class GetDealershipByIdValidator {
    public validate(dto: GetDealershipByIdUseCaseDTO): void {
        if (!dto.dealershipId?.trim()) {
            throw new DealershipValidationError('Dealership ID is required');
        }

        if (!dto.userId?.trim()) {
            throw new DealershipValidationError('User ID is required');
        }

        if (!dto.userRole) {
            throw new DealershipValidationError('User role is required');
        }
    }
}