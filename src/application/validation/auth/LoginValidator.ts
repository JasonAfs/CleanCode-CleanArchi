import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { AuthValidationError } from "@domain/errors/auth/AuthValidationError";

export class LoginValidator {
    public validate(dto: LoginDTO): void {
        if (!dto.email?.trim()) {
            throw new AuthValidationError("Email is required");
        }

        if (!dto.password?.trim()) {
            throw new AuthValidationError("Password is required");
        }
    }
}