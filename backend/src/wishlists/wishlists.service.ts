import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  private findOneWithRelations(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  private async validateWishlistExistence(id: number): Promise<Wishlist> {
    const wishlist = await this.findOneWithRelations(id);
    if (!wishlist) {
      throw new NotFoundException('Запрашиваемый вишлист не существует');
    }
    return wishlist;
  }

  private validateOwnership(wishlist: Wishlist, userId: number) {
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Доступ к этому вишлисту запрещен');
    }
  }

  find(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async create(dto: CreateWishlistDto, userId: number): Promise<Wishlist> {
    const user = await this.usersService.findUserById(userId);
    const items = await this.wishService.find(dto.itemsId);
    const wishlist = this.wishlistRepository.create({
      ...dto,
      owner: user,
      items,
    });
    return this.wishlistRepository.save(wishlist);
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.validateWishlistExistence(id);
  }

  async update(
    id: number,
    dto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.validateWishlistExistence(id);
    this.validateOwnership(wishlist, userId);
    if (dto.itemsId) {
      const newItems = await this.wishService.find(dto.itemsId);
      wishlist.items.push(...newItems);
    }
    Object.assign(wishlist, dto);
    return this.wishlistRepository.save(wishlist);
  }

  async deleteOne(wishId: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.validateWishlistExistence(wishId);
    this.validateOwnership(wishlist, userId);
    await this.wishlistRepository.delete(wishId);
    return wishlist;
  }
}
