import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { AddDealershipEmployeeDTO } from '@application/dtos/dealership/AddDealershipEmployeeDTO';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { AddDealershipEmployeeValidator } from '@application/validation/dealership/AddDealershipEmployeeValidator';


export class AddDealershipEmployeeUseCase implements IAuthorizationAware {
    private readonly validator = new AddDealershipEmployeeValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        private readonly userRepository: IUserRepository
    ) {}

    public getAuthorizationContext(dto: AddDealershipEmployeeDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    private isValidDealershipRole(role: UserRole): boolean {
        return [
            UserRole.DEALERSHIP_MANAGER,
            UserRole.DEALERSHIP_EMPLOYEE,
            UserRole.DEALERSHIP_TECHNICIAN,
            UserRole.DEALERSHIP_STOCK_MANAGER
        ].includes(role);
    }

    @Authorize(Permission.MANAGE_DEALERSHIP_EMPLOYEES)
    public async execute(dto: AddDealershipEmployeeDTO): Promise<Result<void, Error>> {
        try {
            // Validation des données d'entrée
            this.validator.validate(dto);

            // Vérifier que le rôle à assigner est valide
            if (!this.isValidDealershipRole(dto.role)) {
                return new DealershipValidationError('Invalid dealership role');
            }

            // Pour les managers de concession, vérifier qu'ils ne peuvent pas attribuer le rôle manager
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER && 
                dto.role === UserRole.DEALERSHIP_MANAGER) {
                return new UnauthorizedError('Dealership managers cannot assign manager roles');
            }

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

            // Vérifier si l'employé n'est pas déjà associé à une autre concession
            const existingDealership = await this.dealershipRepository.findByEmployee(dto.employeeId);
            if (existingDealership && existingDealership.id !== dto.dealershipId) {
                return new DealershipValidationError('Employee is already associated with another dealership');
            }

            // Mettre à jour le rôle de l'employé
            employee.updateRole(dto.role);
            await this.userRepository.update(employee);

            // Ajouter l'employé à la concession
            dealership.addEmployee(employee);
            await this.dealershipRepository.update(dealership);

            return;
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while adding employee to dealership');
        }
    }
}