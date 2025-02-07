import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { TransferMotorcycleBetweenCompaniesDTO } from '@application/dtos/motorcycle/request/TransferMotorcycleBetweenCompaniesDTO';
import { Result } from '@domain/shared/Result';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { MotorcycleNotFoundError, MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { TransferMotorcycleBetweenCompaniesValidator } from '@application/validation/motorcycle/TransferMotorcycleBetweenCompaniesValidator';
import { TransferMotorcycleBetweenCompaniesResponseDTO } from '@application/dtos/motorcycle/response/TransferMotorcycleBetweenCompaniesResponseDTO';

export class TransferMotorcycleBetweenCompaniesUseCase {
    private readonly validator = new TransferMotorcycleBetweenCompaniesValidator();

    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly companyRepository: ICompanyRepository,
    ) {}

    public async execute(
        dto: TransferMotorcycleBetweenCompaniesDTO
    ): Promise<Result<TransferMotorcycleBetweenCompaniesResponseDTO, Error>> {
        try {
            // 1. Vérification des permissions
            if (![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(dto.userRole)) {
                return new UnauthorizedError("Only TRIUMPH_ADMIN or DEALERSHIP_MANAGER can transfer motorcycles between companies");
            }

            // 2. Validation des données d'entrée
            try {
                this.validator.validate(dto);
            } catch (error) {
                if (error instanceof MotorcycleValidationError) {
                    return error;
                }
                throw error;
            }

            // 3. Récupération de la moto
            const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
            if (!motorcycle) {
                return new MotorcycleNotFoundError(dto.motorcycleId);
            }

            // 4. Vérifier que la moto est assignée à une company
            if (!motorcycle.companyId) {
                return new MotorcycleValidationError("Motorcycle is not assigned to any company");
            }

            // 5. Récupération de la company cible
            const targetCompany = await this.companyRepository.findById(dto.targetCompanyId);
            if (!targetCompany) {
                return new CompanyValidationError(`Target company not found with id: ${dto.targetCompanyId}`);
            }

            // 6. Vérifications spécifiques pour DEALERSHIP_MANAGER
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER) {
                // Vérifier que la moto appartient au dealership du manager
                if (motorcycle.dealershipId !== dto.dealershipId) {
                    return new UnauthorizedError("You don't have access to transfer this motorcycle");
                }

                // Vérifier que la company cible est gérée par le dealership du manager
                if (!targetCompany.belongsToDealership(dto.dealershipId)) {
                    return new UnauthorizedError("You don't have access to transfer motorcycles to this company");
                }
            }

            const previousCompanyId = motorcycle.companyId;

            // 7. Libérer la moto de la company actuelle
            try {
                motorcycle.releaseFromCompany();
            } catch (error) {
                if (error instanceof Error) {
                    return error;
                }
                throw error;
            }

            // 8. Assigner la moto à la nouvelle company
            try {
                motorcycle.assignToCompany(dto.targetCompanyId);
            } catch (error) {
                if (error instanceof Error) {
                    return error;
                }
                throw error;
            }

            // 9. Persistence
            await this.motorcycleRepository.update(motorcycle);

            // 10. Retour de la réponse
            return {
                success: true,
                message: `Motorcycle successfully transferred to company ${targetCompany.name}`,
                motorcycleId: motorcycle.id,
                previousCompanyId,
                newCompanyId: targetCompany.id,
                dealershipId: motorcycle.dealershipId!
            };

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while transferring the motorcycle between companies');
        }
    }
}