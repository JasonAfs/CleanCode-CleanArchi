import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { RemoveDealershipEmployeeDTO } from '@application/dtos/dealership/RemoveDealershipEmployeeDTO';
import { RemoveDealershipEmployeeValidator } from '@application/validation/dealership/RemoveDealershipEmployeeValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';


export class RemoveDealershipEmployeeUseCase implements IAuthorizationAware {
    private readonly validator = new RemoveDealershipEmployeeValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        private readonly userRepository: IUserRepository
    ) {}

    public getAuthorizationContext(dto: RemoveDealershipEmployeeDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize(Permission.MANAGE_DEALERSHIP_EMPLOYEES)
    public async execute(dto: RemoveDealershipEmployeeDTO): Promise<Result<void, Error>> {
        try {
            // Validation des données d'entrée
            this.validator.validate(dto);

            // Récupérer la concession
            const dealership = await this.dealershipRepository.findById(dto.dealershipId);
            if (!dealership) {
                return new DealershipNotFoundError(dto.dealershipId);
            }

            // Vérifier que le manager a accès à cette concession
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER && 
                !dealership.hasEmployee(dto.userId)) {
                return new UnauthorizedError("You don't have access to this dealership");
            }

            // Vérifier que l'employé existe
            const employee = await this.userRepository.findById(dto.employeeId);
            if (!employee) {
                return new UserNotFoundError(dto.employeeId);
            }

            // Vérifier que l'employé appartient bien à cette concession
            if (!dealership.hasEmployee(dto.employeeId)) {
                return new DealershipValidationError('Employee is not associated with this dealership');
            }

            // Un manager ne peut pas retirer un autre manager
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER && 
                employee.role === UserRole.DEALERSHIP_MANAGER) {
                return new UnauthorizedError('Dealership managers cannot remove other managers');
            }

            // On ne peut pas retirer le dernier manager d'une concession
            if (employee.role === UserRole.DEALERSHIP_MANAGER) {
                const remainingManagers = dealership.employees.getByRole(UserRole.DEALERSHIP_MANAGER)
                    .filter(manager => manager.id !== dto.employeeId);
                if (remainingManagers.length === 0) {
                    return new DealershipValidationError('Cannot remove the last manager of a dealership');
                }
            }

            // Retirer l'employé de la concession
            dealership.removeEmployee(dto.employeeId);
            await this.dealershipRepository.update(dealership);

            // Réinitialiser le rôle de l'employé
            employee.updateRole(UserRole.CLIENT);
            await this.userRepository.update(employee);

            return;
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while removing employee from dealership');
        }
    }
}