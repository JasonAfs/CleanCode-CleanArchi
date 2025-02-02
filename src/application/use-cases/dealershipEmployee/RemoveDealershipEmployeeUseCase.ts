import { Authorize } from "@application/decorators/Authorize";
import { IAuthorizationAware } from "@domain/services/authorization/IAuthorizationAware";
import { RemoveDealershipEmployeeValidator } from "@application/validation/dealership/RemoveDealershipEmployeeValidator";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { RemoveDealershipEmployeeDTO } from "@application/dtos/dealership/request/RemoveDealershipEmployeeDTO";
import { AuthorizationContext } from "@domain/services/authorization/AuthorizationContext";
import { Result } from "@domain/shared/Result";
import { Permission } from "@domain/services/authorization/Permission";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";
import { UserRole } from "@domain/enums/UserRole";
import { UserNotFoundError } from "@domain/errors/user/UserNotFoundError";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";
import { RemoveDealershipEmployeeResponseDTO } from "@application/dtos/dealership/response/RemoveDealershipEmployeeResponseDTO";

export class RemoveDealershipEmployeeUseCase implements IAuthorizationAware {
    private readonly validator = new RemoveDealershipEmployeeValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        private readonly userRepository: IUserRepository,
    ) {
    }

    public getAuthorizationContext(dto: RemoveDealershipEmployeeDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            resourceId: dto.dealershipId,
            dealershipId: dto.userDealershipId,
            resourceType: 'dealership'
        };
    }

    @Authorize(Permission.MANAGE_DEALERSHIP_EMPLOYEES)
    public async execute(dto: RemoveDealershipEmployeeDTO): Promise<Result<RemoveDealershipEmployeeResponseDTO, Error>> {
        try {
            // Étape 1: Validation des données d'entrée
            try {
                this.validator.validate(dto);
            } catch (error) {
                if (error instanceof DealershipValidationError) {
                    return error;
                }
                throw error;
            }

            // Étape 2: Récupérer la concession
            const dealership = await this.dealershipRepository.findById(dto.dealershipId);
            if (!dealership) {
                return new DealershipNotFoundError(dto.dealershipId);
            }

            // Étape 4: Vérifier que l'employé existe
            const employee = await this.userRepository.findById(dto.employeeId);
            if (!employee) {
                return new UserNotFoundError(dto.employeeId);
            }

            // Étape 5: Vérifier que l'employé appartient bien à cette concession
            if (!dealership.hasEmployee(dto.employeeId)) {
                return new DealershipValidationError('Employee is not associated with this dealership');
            }

            // Étape 6: Vérification des règles métier pour les managers
            if (employee.role === UserRole.DEALERSHIP_MANAGER) {
                const remainingManagers = dealership.employees.getByRole(UserRole.DEALERSHIP_MANAGER)
                    .filter(manager => manager.id !== dto.employeeId);
                
                if (remainingManagers.length === 0) {
                    return new DealershipValidationError('Cannot remove the last manager of a dealership');
                }
            }

            // Étape 7: Retirer l'employé de la concession
            dealership.removeEmployee(dto.employeeId);
            await this.dealershipRepository.update(dealership);

            // Étape 8: Réinitialiser le rôle de l'employé
            employee.updateRole(UserRole.CLIENT);
            await this.userRepository.update(employee);

            return {
                success: true,
                message: `Employee ${employee.firstName} ${employee.lastName} has been successfully removed from dealership ${dealership.name}`,
                dealershipId: dealership.id,
                removedEmployeeId: employee.id,
                remainingEmployeesCount: dealership.employees.getAll().length
            };

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while removing employee from dealership');
        }
    }
}