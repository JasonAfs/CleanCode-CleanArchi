import { UpdateUserInfoDTO } from "@application/dtos/user/UpdateUserInfoDTO";
import { UpdateUserInfoValidator } from "@application/validation/user/UpdateUserInfoValidator";
import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { UserNotFoundError } from "@domain/errors/user/UserNotFoundError";

export class UpdateUserInfoUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly validator: UpdateUserInfoValidator
    ) {}

    public async execute(dto: UpdateUserInfoDTO): Promise<void> {
        // Valider les données d'entrée
        this.validator.validate(dto);

        // Récupérer l'utilisateur
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new UserNotFoundError(dto.userId);
        }

        // Mettre à jour les informations
        user.updatePersonalInfo(dto.firstName.trim(), dto.lastName.trim());

        // Sauvegarder les modifications
        await this.userRepository.update(user);
    }
}