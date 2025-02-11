import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { AssignMotorcycleToCompanyDTO } from '@application/dtos/motorcycle/request/AssignMotorcycleToCompanyDTO';
import { Result } from '@domain/shared/Result';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserRole } from '@domain/enums/UserRole';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { AssignMotorcycleToCompanyResponseDTO } from '@application/dtos/motorcycle/response/AssignMotorcycleToCompanyResponseDTO';
import { AssignMotorcycleToCompanyValidator } from '@application/validation/motorcycle/AssignMotorcycleToCompanyValidator';

export class AssignMotorcycleToCompanyUseCase {
  private readonly validator = new AssignMotorcycleToCompanyValidator();

  constructor(
    private readonly motorcycleRepository: IMotorcycleRepository,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  public async execute(
    dto: AssignMotorcycleToCompanyDTO,
  ): Promise<Result<AssignMotorcycleToCompanyResponseDTO, Error>> {
    try {
      // 1. Vérification des permissions
      if (
        ![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(
          dto.userRole,
        )
      ) {
        return new UnauthorizedError(
          'Only TRIUMPH_ADMIN or DEALERSHIP_MANAGER can assign motorcycles to companies',
        );
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
      const motorcycle = await this.motorcycleRepository.findById(
        dto.motorcycleId,
      );
      if (!motorcycle) {
        return new MotorcycleNotFoundError(dto.motorcycleId);
      }

      // 4. Récupération de la company
      const company = await this.companyRepository.findById(dto.companyId);
      if (!company) {
        return new CompanyValidationError(
          `Company not found with id: ${dto.companyId}`,
        );
      }

      // 5. Vérifications spécifiques pour DEALERSHIP_MANAGER
      if (dto.userRole === UserRole.DEALERSHIP_MANAGER) {
        // Vérifier que la moto appartient au dealership du manager
        if (motorcycle.dealershipId !== dto.dealershipId) {
          return new UnauthorizedError(
            "You don't have access to assign this motorcycle",
          );
        }

        // Vérifier que la company est gérée par le dealership du manager
        if (!company.belongsToDealership(dto.dealershipId)) {
          return new UnauthorizedError(
            "You don't have access to assign motorcycles to this company",
          );
        }
      }

      // 6. Assigner la moto à la company
      try {
        motorcycle.assignToCompany(dto.companyId);
      } catch (error) {
        if (error instanceof Error) {
          return error;
        }
        throw error;
      }

      // 7. Persistence
      await this.motorcycleRepository.update(motorcycle);

      // 8. Retour de la réponse
      return {
        success: true,
        message: `Motorcycle successfully assigned to company ${company.name}`,
        motorcycleId: motorcycle.id,
        companyId: company.id,
        dealershipId: motorcycle.dealershipId!,
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while assigning the motorcycle to company',
      );
    }
  }
}
