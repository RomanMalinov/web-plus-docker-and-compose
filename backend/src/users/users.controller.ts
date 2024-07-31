import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from './entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findOwn(@Req() { user }: { user: User }) {
    return this.usersService.findUserById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user }: { user: User },
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  getOwnWishes(@Req() { user }: { user: User }) {
    return this.usersService.findWishes(user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (!user)
      throw new NotFoundException('Указанный пользователь отсутствует');
    return user;
  }

  @Get(':username/wishes')
  async getUsersWishes(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('find')
  async findMany(@Body() data: { query: string }) {
    return this.usersService.findUsers(data.query);
  }
}
