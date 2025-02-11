import { User } from '@domain/entities/UserEntity';
import { UserResponseDTO } from '../dtos/user/response/UserResponseDTO';

export class UserMapper {
  public static toDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.toString(),
      role: user.role,
      isActive: user.isActive,
    };
  }
}
