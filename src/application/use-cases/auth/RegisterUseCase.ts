import { RegisterDTO } from "@application/dtos/auth/RegisterDTO";
import { AuthTokensDTO } from "@application/dtos/auth/AuthTokensDTO";
import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { IPasswordService } from "@application/ports/services/IPasswordService";
import { IAuthenticationService } from "@application/ports/services/IAuthenticationService";
import { RegisterValidator } from "@application/validation/auth/RegisterValidator";
import { User } from "@domain/entities/UserEntity";
import { Email } from "@domain/value-objects/Email";
import { UserRole } from "@domain/enums/UserRole";
import { AuthValidationError } from "@domain/errors/auth/AuthValidationError";
import { UserAlreadyExistsError } from "@domain/errors/user/UserAlreadyExistsError";

export class RegisterUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly authService: IAuthenticationService,
        private readonly validator: RegisterValidator
    ) {}

    public async execute(dto: RegisterDTO): Promise<AuthTokensDTO> {
        // 1. Validation des données d'entrée
        this.validator.validate(dto);

        // 2. Vérification de l'existence de l'utilisateur
        const existingUser = await this.userRepository.findByEmail(new Email(dto.email));
        if (existingUser) {
            throw new UserAlreadyExistsError(dto.email);
        }

        // 3. Validation contextuelle en fonction du rôle
        await this.validateRoleContext(dto);

        // 4. Hashage du mot de passe
        const hashedPassword = await this.passwordService.hashPassword(dto.password);

        // 5. Préparation des données de l'utilisateur
        const companyId = this.validateAndGetCompanyId(dto);
        const dealershipId = this.validateAndGetDealershipId(dto);

        // 6. Création de l'utilisateur
        const user = User.create({
            email: new Email(dto.email),
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            role: dto.role,
            companyId,
            hashedPassword
        });

        // 7. Sauvegarde de l'utilisateur
        await this.userRepository.create(user);

        // 8. Génération des tokens d'authentification
        return this.authService.generateTokens(user.id, user.role);
    }

    private async validateRoleContext(dto: RegisterDTO): Promise<void> {
        switch (dto.role) {
            case UserRole.COMPANY_MANAGER:
            case UserRole.COMPANY_DRIVER:
                if (!dto.companyId?.trim()) {
                    throw new AuthValidationError("Company ID is required for company roles");
                }
                // Ici, on pourrait ajouter une vérification que la company existe
                break;

            case UserRole.DEALERSHIP_MANAGER:
            case UserRole.DEALERSHIP_EMPLOYEE:
            case UserRole.DEALERSHIP_TECHNICIAN:
                if (!dto.dealershipId?.trim()) {
                    throw new AuthValidationError("Dealership ID is required for dealership roles");
                }
                // Ici, on pourrait ajouter une vérification que le dealership existe
                break;

            case UserRole.TRIUMPH_ADMIN:
                // Les admins n'ont pas besoin de validation supplémentaire
                break;

            case UserRole.CLIENT:
                // Les clients n'ont pas besoin de validation supplémentaire
                break;

            default:
                throw new AuthValidationError(`Invalid role: ${dto.role}`);
        }
    }

    private validateAndGetCompanyId(dto: RegisterDTO): string {
        if (dto.role === UserRole.COMPANY_MANAGER || dto.role === UserRole.COMPANY_DRIVER) {
            if (!dto.companyId?.trim()) {
                throw new AuthValidationError("Company ID is required for company roles");
            }
            return dto.companyId.trim();
        }
        return ""; // Pour les autres rôles
    }

    private validateAndGetDealershipId(dto: RegisterDTO): string {
        if (dto.role === UserRole.DEALERSHIP_MANAGER || 
            dto.role === UserRole.DEALERSHIP_EMPLOYEE || 
            dto.role === UserRole.DEALERSHIP_TECHNICIAN) {
            if (!dto.dealershipId?.trim()) {
                throw new AuthValidationError("Dealership ID is required for dealership roles");
            }
            return dto.dealershipId.trim();
        }
        return ""; // Pour les autres rôles
    }
}