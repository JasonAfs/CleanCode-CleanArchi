// src/application/validation/user/CreateUserValidator.ts
import { CreateUserDTO } from '@application/dtos/user/CreateUserDTO';
import { UserValidationError } from '@domain/errors/user/UserValidationError';
import { Email } from '@domain/value-objects/Email';

export class CreateUserValidator {
  public validate(dto: CreateUserDTO): void {
    if (!dto.firstName?.trim()) {
      throw new UserValidationError('First name is required');
    }

    if (!dto.lastName?.trim()) {
      throw new UserValidationError('Last name is required');
    }

    if (!dto.email?.trim()) {
      throw new UserValidationError('Email is required');
    }

    // Utilisation du Value Object Email pour la validation
    try {
      new Email(dto.email);
    } catch (error) {
      throw new UserValidationError('Invalid email format');
    }

    if (!dto.password?.trim()) {
      throw new UserValidationError('Password is required');
    }

    if (dto.password.length < 8) {
      throw new UserValidationError(
        'Password must be at least 8 characters long',
      );
    }

    if (!dto.companyId?.trim()) {
      throw new UserValidationError('Company ID is required');
    }
  }
}
