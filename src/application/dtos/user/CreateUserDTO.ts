import { UserRole } from '@domain/enums/UserRole';

export interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  companyId: string;
}
