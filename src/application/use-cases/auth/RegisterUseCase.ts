import { RegisterDTO } from "@application/dtos/auth/RegisterDTO";
import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { IPasswordService } from "@application/ports/services/IPasswordService";
import { RegisterValidator } from "@application/validation/auth/RegisterValidator";
import { User } from "@domain/entities/UserEntity";
import { Email } from "@domain/value-objects/Email";
import { UserRole } from "@domain/enums/UserRole";
import { UserAlreadyExistsError } from "@domain/errors/user/UserAlreadyExistsError";
import { Result } from "@domain/shared/Result";

interface RegisterSuccess {
    success: boolean;
    message: string;
}

export class RegisterUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
    ) {}
    
    private readonly validator = new RegisterValidator();

    public async execute(dto: RegisterDTO): Promise<Result<RegisterSuccess, Error>> {
        this.validator.validate(dto);

        const existingUser = await this.userRepository.findByEmail(new Email(dto.email));
        if (existingUser) {
            return new UserAlreadyExistsError(dto.email); 
        }

        const hashedPassword = await this.passwordService.hashPassword(dto.password);

        const user = User.create({
            email: new Email(dto.email),
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            role: UserRole.CLIENT,
            companyId: '',
            hashedPassword
        });

        await this.userRepository.create(user);

        return {
            success: true,
            message: 'User registered successfully'
        };
    }
}