import { CreateUserUseCase } from '@application/use-cases/user/CreateUserUseCase';
import { CreateUserValidator } from '@application/validation/user/CreateUserValidator';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { IPasswordService } from '@application/ports/services/IPasswordService';
import { UserRole } from '@domain/enums/UserRole';
import { Email } from '@domain/value-objects/Email';
import { UserAlreadyExistsError } from '@domain/errors/user/UserAlreadyExistsError';

// Création des mocks
const mockUserRepository: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByCompanyId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    findByRole: jest.fn(),
    exists: jest.fn(),
};

const mockPasswordService: jest.Mocked<IPasswordService> = {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
};

describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase;
    let validator: CreateUserValidator;

    const validCreateUserDTO = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: UserRole.DEALER_EMPLOYEE,
        companyId: 'company123'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        validator = new CreateUserValidator();
        useCase = new CreateUserUseCase(
            mockUserRepository,
            mockPasswordService,
            validator
        );

        // Configuration par défaut des mocks
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockPasswordService.hashPassword.mockResolvedValue('hashedPassword123');
    });

    describe('success cases', () => {
        it('should create a new user with valid data', async () => {
            const user = await useCase.execute(validCreateUserDTO);

            expect(user).toBeDefined();
            expect(user.email.toString()).toBe(validCreateUserDTO.email);
            expect(user.firstName).toBe(validCreateUserDTO.firstName);
            expect(user.lastName).toBe(validCreateUserDTO.lastName);
            expect(user.role).toBe(validCreateUserDTO.role);
            expect(user.companyId).toBe(validCreateUserDTO.companyId);
            expect(user.isActive).toBe(true);

            // Vérification des appels aux services
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
                expect.any(Email)
            );
            expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
                validCreateUserDTO.password
            );
            expect(mockUserRepository.create).toHaveBeenCalledWith(user);
        });
    });

    describe('failure cases', () => {
        it('should throw UserAlreadyExistsError if email already exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({} as any);

            await expect(useCase.execute(validCreateUserDTO))
                .rejects
                .toThrow(UserAlreadyExistsError);

            expect(mockPasswordService.hashPassword).not.toHaveBeenCalled();
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });

        it('should validate input data', async () => {
            const invalidDTO = {
                ...validCreateUserDTO,
                email: 'invalid-email'
            };

            await expect(useCase.execute(invalidDTO)).rejects.toThrow();
            expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
            expect(mockPasswordService.hashPassword).not.toHaveBeenCalled();
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });

        it('should propagate password service errors', async () => {
            const error = new Error('Password hashing failed');
            mockPasswordService.hashPassword.mockRejectedValue(error);

            await expect(useCase.execute(validCreateUserDTO))
                .rejects
                .toThrow(error);

            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');
            mockUserRepository.create.mockRejectedValue(error);

            await expect(useCase.execute(validCreateUserDTO))
                .rejects
                .toThrow(error);
        });
    });
});