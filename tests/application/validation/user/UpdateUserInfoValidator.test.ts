import { UpdateUserInfoValidator } from '@application/validation/user/UpdateUserInfoValidator';
import { UpdateUserInfoDTO } from '@application/dtos/user/UpdateUserInfoDTO';
import { UserValidationError } from '@domain/errors/user/UserValidationError';
import { randomUUID } from 'crypto';

describe('UpdateUserInfoValidator', () => {
    let validator: UpdateUserInfoValidator;
    let validDto: UpdateUserInfoDTO;

    beforeEach(() => {
        validator = new UpdateUserInfoValidator();
        validDto = {
            userId: randomUUID(),
            firstName: 'John',
            lastName: 'Doe'
        };
    });

    it('should pass validation with valid data', () => {
        expect(() => validator.validate(validDto)).not.toThrow();
    });

    describe('userId validation', () => {
        it('should throw error for empty userId', () => {
            validDto.userId = '';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('User ID is required'));
        });

        it('should throw error for userId with only spaces', () => {
            validDto.userId = '   ';
            expect(() => validator.validate(validDto))
                .toThrow(new UserValidationError('User ID is required'));
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
});