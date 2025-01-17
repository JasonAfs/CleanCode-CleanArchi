import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { IPasswordService } from '@application/ports/services/IPasswordService';
import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';
import { InMemoryUserRepository } from '@infrastructure/repositories/in-memory/InMemoryUserRepository';
import { RegisterValidator } from '@application/validation/auth/RegisterValidator';
import { UserRole } from '@domain/enums/UserRole';
import { UserAlreadyExistsError } from '@domain/errors/user/UserAlreadyExistsError';
import { AuthValidationError } from '@domain/errors/auth/AuthValidationError';
import { Email } from '@domain/value-objects/Email';

describe('RegisterUseCase', () => {
    let useCase: RegisterUseCase;
    let userRepository: IUserRepository;
    let passwordService: IPasswordService;
    let authService: IAuthenticationService;
    let validator: RegisterValidator;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        
        passwordService = {
            hashPassword: jest.fn().mockResolvedValue('hashed_password'),
            verifyPassword: jest.fn()
        };

        authService = {
            generateTokens: jest.fn().mockResolvedValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token'
            }),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
            revokeRefreshToken: jest.fn()
        };

        validator = new RegisterValidator();
        useCase = new RegisterUseCase(userRepository, passwordService, authService, validator);
    });

    it('should successfully register a company manager', async () => {
        const result = await useCase.execute({
            email: 'manager@company.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.COMPANY_MANAGER,
            companyId: 'company-123'
        });

        expect(result).toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
        });

        const user = await userRepository.findByEmail(new Email('manager@company.com'));
        expect(user).toBeDefined();
        expect(user?.role).toBe(UserRole.COMPANY_MANAGER);
    });

    it('should throw error when registering company role without companyId', async () => {
        await expect(useCase.execute({
            email: 'manager@company.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.COMPANY_MANAGER
        })).rejects.toThrow(AuthValidationError);
    });

    it('should throw error when user already exists', async () => {
        // Premier enregistrement
        await useCase.execute({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.CLIENT
        });

        // Deuxième enregistrement avec le même email
        await expect(useCase.execute({
            email: 'test@example.com',
            password: 'different123',
            firstName: 'Jane',
            lastName: 'Doe',
            role: UserRole.CLIENT
        })).rejects.toThrow(UserAlreadyExistsError);
    });
});