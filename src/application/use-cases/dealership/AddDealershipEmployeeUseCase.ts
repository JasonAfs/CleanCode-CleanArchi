import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { AddDealershipEmployeeDTO } from "@application/dtos/dealership/AddDealershipEmployeeDTO";
import { AddDealershipEmployeeValidator } from "@application/validation/dealership/AddDealershipEmployeeValidator";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";
import { UserNotFoundError } from "@domain/errors/user/UserNotFoundError";

export class AddEmployeeUseCase {
    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        private readonly userRepository: IUserRepository,
        private readonly validator: AddDealershipEmployeeValidator
    ) {}

    public async execute(dto: AddDealershipEmployeeDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get dealership
        const dealership = await this.dealershipRepository.findById(dto.dealershipId);
        if (!dealership) {
            throw new DealershipNotFoundError(dto.dealershipId);
        }

        // Get user
        const user = await this.userRepository.findById(dto.employeeId);
        if (!user) {
            throw new UserNotFoundError(dto.employeeId);
        }

        // Update user role if different
        if (user.role !== dto.role) {
            user.updateRole(dto.role);
            await this.userRepository.update(user);
        }

        // Add employee to dealership
        dealership.addEmployee(user);

        // Save changes
        await this.dealershipRepository.update(dealership);
    }
}