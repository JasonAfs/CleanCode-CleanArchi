import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { AuthTokensDTO } from "@application/dtos/auth/AuthTokensDTO";
import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { IPasswordService } from "@application/ports/services/IPasswordService";
import { IAuthenticationService } from "@application/ports/services/IAuthenticationService";
import { LoginValidator } from "@application/validation/auth/LoginValidator";
import { Email } from "@domain/value-objects/Email";
import { InvalidCredentialsError } from "@domain/errors/auth/InvalidCredentialsError";
import { Result } from "@domain/shared/Result";

export class LoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly authService: IAuthenticationService,
    ) {}

    private readonly validator = new LoginValidator();

    public async execute(dto: LoginDTO): Promise<Result<AuthTokensDTO, Error>> {
        this.validator.validate(dto);

        const user = await this.userRepository.findByEmail(new Email(dto.email));
        if (!user) {
            return new InvalidCredentialsError(); 
        }

        const isValid = await this.passwordService.verifyPassword(
            dto.password, 
            user.getHashedPassword()
        );
        
        if (!isValid) {
            return new InvalidCredentialsError(); 
        }

        return this.authService.generateTokens(user.id, user.role);
    }
}