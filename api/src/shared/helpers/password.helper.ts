import * as bcrypt from 'bcryptjs';
import { IPasswordHelper } from './password.interface';

export class PasswordHelper implements IPasswordHelper {
  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 4);
    return hashedPassword;
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
