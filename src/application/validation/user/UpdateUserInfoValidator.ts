import { UpdateUserInfoDTO } from "@application/dtos/user/UpdateUserInfoDTO";
import { UserValidationError } from "@domain/errors/user/UserValidationError";

export class UpdateUserInfoValidator {
    public validate(dto: UpdateUserInfoDTO): void {
        if (!dto.userId?.trim()) {
            throw new UserValidationError('User ID is required');
        }

        if (!dto.firstName?.trim()) {
            throw new UserValidationError('First name is required');
        }

        if (!dto.lastName?.trim()) {
            throw new UserValidationError('Last name is required');
        }
    }
}