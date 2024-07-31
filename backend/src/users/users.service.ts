import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly salt = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(String(password), this.salt);
  }

  private async checkUsernameOrEmailExist(
    username: string,
    email: string,
  ): Promise<void> {
    const user = await this.userRepository.find({
      where: [{ username }, { email }],
    });
    if (user.length) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
  }

  async create(dto: CreateUserDto) {
    await this.checkUsernameOrEmailExist(dto.username, dto.email);
    dto.password = await this.hashPassword(dto.password);
    const newUser = this.userRepository.create({
      ...dto,
      offers: [],
      wishes: [],
      wishlists: [],
    });
    return await this.userRepository.save(newUser);
  }

  async findOne(search: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ email: search }, { username: search }],
    });
  }

  async findUserById(id: number) {
    const { password, ...user } = await this.userRepository.findOne({
      where: { id },
    });
    if (!user && !password) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findUsers(query: string) {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (dto.username && dto.username !== user.username) {
      const existingUserByUsername = await this.findOne(dto.username);
      if (existingUserByUsername) {
        throw new ConflictException(
          'Пользователь с таким username уже зарегистрирован',
        );
      }
    }
    if (dto.email && dto.email !== user.email) {
      const existingUserByEmail = await this.findOne(dto.email);
      if (existingUserByEmail) {
        throw new ConflictException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
    }
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }
    await this.userRepository.update(id, dto);
    return this.findUserById(id);
  }

  async findWishes(username: string) {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('Указанный пользователь не существует');
    }
    const userWithWishes = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
      select: ['wishes'],
    });
    return userWithWishes?.wishes;
  }
}
