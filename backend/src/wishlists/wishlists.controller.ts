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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard)
@UseGuards(ThrottlerGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() { user }: { user: User },
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() { user }: { user: User },
  ): Promise<Wishlist> {
    return this.wishlistsService.update(id, updateWishlistDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOne(
    @Param('id') id: number,
    @Req() { user }: { user: User },
  ): Promise<Wishlist> {
    return this.wishlistsService.deleteOne(id, user.id);
  }
}
