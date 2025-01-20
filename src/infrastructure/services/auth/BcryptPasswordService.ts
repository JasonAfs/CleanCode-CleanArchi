import { IPasswordService } from '@application/ports/services/IPasswordService';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordService implements IPasswordService {
  private readonly saltRounds = 10;

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  public async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
