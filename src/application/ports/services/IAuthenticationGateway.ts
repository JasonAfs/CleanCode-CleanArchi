import { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';
import { LoginDTO } from '@application/dtos/auth/LoginDTO';
import { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
import { User } from '@domain/entities/UserEntity';

export interface IAuthenticationGateway {
  login(credentials: LoginDTO): Promise<AuthTokensDTO>;
  register(data: RegisterDTO): Promise<AuthTokensDTO>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}
