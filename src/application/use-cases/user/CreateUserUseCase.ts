import { CreateUserDTO } from '@application/dtos/user/CreateUserDTO';
import { CreateUserValidator } from '@application/validation/user/CreateUserValidator';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { IPasswordService } from '@application/ports/services/IPasswordService';
import { User } from '@domain/entities/UserEntity';
import { Email } from '@domain/value-objects/Email';
import { UserAlreadyExistsError } from '@domain/errors/user/UserAlreadyExistsError';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly validator: CreateUserValidator,
  ) {}

  public async execute(dto: CreateUserDTO): Promise<User> {
    // Valider les données d'entrée
    this.validator.validate(dto);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(
      new Email(dto.email),
    );
    if (existingUser) {
      throw new UserAlreadyExistsError(dto.email);
    }

    // Hasher le mot de passe
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );

    // Créer l'utilisateur
    const user = User.create({
      email: new Email(dto.email),
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      role: dto.role,
      companyId: dto.companyId.trim(),
      hashedPassword,
    });

    // Sauvegarder l'utilisateur
    await this.userRepository.create(user);

    return user;
  }
}
