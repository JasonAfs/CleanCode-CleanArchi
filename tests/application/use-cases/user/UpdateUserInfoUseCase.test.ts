import { UpdateUserInfoUseCase } from '@application/use-cases/user/UpdateUserInfoUseCase';
import { UpdateUserInfoValidator } from '@application/validation/user/UpdateUserInfoValidator';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { User } from '@domain/entities/UserEntity';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { randomUUID } from 'crypto';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';

// Mock du repository
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
    exists: jest.fn()
};

describe('UpdateUserInfoUseCase', () => {
    let useCase: UpdateUserInfoUseCase;
    let validator: UpdateUserInfoValidator;
    
    const userId = randomUUID();
    const validUpdateUserDTO = {
        userId,
        firstName: 'Jane',
        lastName: 'Smith'
    };

    const existingUser = User.create({
        email: new Email('test@example.com'),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.DEALER_EMPLOYEE,
        companyId: 'company123',
        hashedPassword: 'hashedPassword123'
    });

    beforeEach(() => {
        jest.clearAllMocks();
        validator = new UpdateUserInfoValidator();
        useCase = new UpdateUserInfoUseCase(mockUserRepository, validator);

        // Configuration par défaut des mocks
        mockUserRepository.findById.mockResolvedValue(existingUser);
    });

    describe('success cases', () => {
        it('should update user info with valid data', async () => {
            await useCase.execute(validUpdateUserDTO);

            expect(existingUser.firstName).toBe(validUpdateUserDTO.firstName);
            expect(existingUser.lastName).toBe(validUpdateUserDTO.lastName);
            
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.update).toHaveBeenCalledWith(existingUser);
        });
    });

    describe('failure cases', () => {
        it('should throw UserNotFoundError if user does not exist', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(useCase.execute(validUpdateUserDTO))
                .rejects
                .toThrow(UserNotFoundError);

            expect(mockUserRepository.update).not.toHaveBeenCalled();
        });

        it('should validate input data', async () => {
            const invalidDTO = {
                ...validUpdateUserDTO,
                firstName: ''
            };

            await expect(useCase.execute(invalidDTO)).rejects.toThrow();
            expect(mockUserRepository.update).not.toHaveBeenCalled();
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');
            mockUserRepository.update.mockRejectedValue(error);

            await expect(useCase.execute(validUpdateUserDTO))
                .rejects
                .toThrow(error);
        });
    });
});