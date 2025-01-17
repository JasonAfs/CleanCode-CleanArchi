import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { IPasswordService } from '@application/ports/services/IPasswordService';
import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';
import { InMemoryUserRepository } from '@infrastructure/repositories/in-memory/InMemoryUserRepository';
import { LoginValidator } from '@application/validation/auth/LoginValidator';
import { User } from '@domain/entities/UserEntity';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';
import { InvalidCredentialsError } from '@domain/errors/auth/InvalidCredentialsError';


describe('LoginUseCase', () => {
    let useCase: LoginUseCase;
    let userRepository: IUserRepository;
    let passwordService: IPasswordService;
    let authService: IAuthenticationService;
    let validator: LoginValidator;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        
        // Mock du password service
        passwordService = {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn()
        };

        // Mock du auth service
        authService = {
            generateTokens: jest.fn(),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
            revokeRefreshToken: jest.fn()
        };

        validator = new LoginValidator();
        useCase = new LoginUseCase(userRepository, passwordService, authService, validator);
    });

    it('should successfully login user with valid credentials', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        const hashedPassword = 'hashed_password';
        const userId = 'test-user-id';
        const role = UserRole.COMPANY_MANAGER;

        // Créer un utilisateur test
        const user = User.create({
            email: new Email(email),
            firstName: 'John',
            lastName: 'Doe',
            role: role,
            companyId: 'company-123',
            hashedPassword
        });

        await userRepository.create(user);

        // Configure mocks
        (passwordService.verifyPassword as jest.Mock).mockResolvedValue(true);
        (authService.generateTokens as jest.Mock).mockResolvedValue({
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
        });

        // Act
        const result = await useCase.execute({ email, password });

        // Assert
        expect(result).toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
        });
        expect(passwordService.verifyPassword).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should throw InvalidCredentialsError when user not found', async () => {
        // Act & Assert
        await expect(useCase.execute({
            email: 'nonexistent@example.com',
            password: 'password123'
        })).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw InvalidCredentialsError when password is incorrect', async () => {
        // Arrange
        const email = 'test@example.com';
        const user = User.create({
            email: new Email(email),
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.COMPANY_MANAGER,
            companyId: 'company-123',
            hashedPassword: 'hashed_password'
        });

        await userRepository.create(user);
        (passwordService.verifyPassword as jest.Mock).mockResolvedValue(false);

        // Act & Assert
        await expect(useCase.execute({
            email,
            password: 'wrong-password'
        })).rejects.toThrow(InvalidCredentialsError);
    });
});