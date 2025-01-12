import { CreateUserValidator } from '@application/validation/user/CreateUserValidator';
import { CreateUserDTO } from '@application/dtos/user/CreateUserDTO';
import { UserRole } from '@domain/enums/UserRole';
import { UserValidationError } from '@domain/errors/user/UserValidationError';

describe('CreateUserValidator', () => {
    let validator: CreateUserValidator;
    let validDto: CreateUserDTO;

    beforeEach(() => {
        validator = new CreateUserValidator();
        validDto = {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
            role: UserRole.DEALER_EMPLOYEE,
            companyId: 'company123'
        };
    });

    it('should pass validation with valid data', () => {
        expect(() => validator.validate(validDto)).not.toThrow();
    });

    describe('email validation', () => {
        it('should throw error for empty email', () => {
            validDto.email = '';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Email is required'));
        });

        it('should throw error for invalid email format', () => {
            validDto.email = 'invalid-email';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Invalid email format'));
        });

        it('should throw error for email without domain', () => {
            validDto.email = 'test@';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Invalid email format'));
        });
    });

    describe('firstName validation', () => {
        it('should throw error for empty firstName', () => {
            validDto.firstName = '';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('First name is required'));
        });

        it('should throw error for firstName with only spaces', () => {
            validDto.firstName = '   ';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('First name is required'));
        });
    });

    describe('lastName validation', () => {
        it('should throw error for empty lastName', () => {
            validDto.lastName = '';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Last name is required'));
        });

        it('should throw error for lastName with only spaces', () => {
            validDto.lastName = '   ';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Last name is required'));
        });
    });

    describe('password validation', () => {
        it('should throw error for empty password', () => {
            validDto.password = '';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Password is required'));
        });

        it('should throw error for password with only spaces', () => {
            validDto.password = '   ';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Password is required'));
        });

        it('should throw error for password shorter than 8 characters', () => {
            validDto.password = '1234567';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Password must be at least 8 characters long'));
        });
    });

    describe('companyId validation', () => {
        it('should throw error for empty companyId', () => {
            validDto.companyId = '';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Company ID is required'));
        });

        it('should throw error for companyId with only spaces', () => {
            validDto.companyId = '   ';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('Company ID is required'));
        });
    });
});