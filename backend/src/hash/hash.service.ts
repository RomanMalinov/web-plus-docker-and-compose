import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class HashService {
  async generateSalt(rounds: number): Promise<string> {
    return await genSalt(rounds);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await this.generateSalt(10);
    return await hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
