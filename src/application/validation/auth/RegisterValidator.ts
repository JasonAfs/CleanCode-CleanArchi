import { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
import { AuthValidationError } from '@domain/errors/auth/AuthValidationError';
import { Email } from '@domain/value-objects/Email';

export class RegisterValidator {
  public validate(dto: RegisterDTO): void {
    if (!dto.email?.trim()) {
      throw new AuthValidationError('Email is required');
    }

    try {
      new Email(dto.email);
    } catch (error) {
      throw new AuthValidationError('Invalid email format');
    }

    if (!dto.password?.trim()) {
      throw new AuthValidationError('Password is required');
    }

    if (dto.password.length < 8) {
      throw new AuthValidationError(
        'Password must be at least 8 characters long',
      );
    }

    if (!dto.firstName?.trim()) {
      throw new AuthValidationError('First name is required');
    }

    if (!dto.lastName?.trim()) {
      throw new AuthValidationError('Last name is required');
    }
  }
}
