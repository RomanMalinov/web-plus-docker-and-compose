import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { compare } from 'bcrypt';
import { authDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(user: User) {
    const accessToken = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    return { access_token: accessToken };
  }
  signup(signUpDto: authDto): Promise<User> {
    return this.usersService.create(signUpDto);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException(
        'Ошибка входа: проверьте правильность имени пользователя и пароля',
      );
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Неверное Ошибка входа: проверьте правильность имени пользователя и пароля или пароль',
      );
    }

    return user;
  }
}
