import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('wishes')
@UseGuards(ThrottlerGuard)
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() { user }: { user: User },
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishService.create(user.id, createWishDto);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wish> {
    return this.wishService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() { user }: { user: User }) {
    return this.wishService.copy(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    return this.wishService.update(id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeOne(@Param('id') id: number, @Req() { user }: { user: User }) {
    return this.wishService.deleteOne(id, user.id);
  }
}
