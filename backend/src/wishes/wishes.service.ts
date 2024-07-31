import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, dto: CreateWishDto): Promise<Wish> {
    const owner = await this.userService.findUserById(userId);
    const wish = this.wishRepository.create({ ...dto, owner });
    return this.wishRepository.save(wish);
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) throw new NotFoundException('Подарок не найден');
    return wish;
  }

  async find(idArr: number[]): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { id: In(idArr) },
    });
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 30,
      order: { createdAt: 'DESC' },
      relations: ['owner', 'offers'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 30,
      order: { copied: 'DESC' },
      relations: ['owner', 'offers'],
    });
  }

  async update(wishId: number, dto: UpdateWishDto): Promise<void> {
    const wish = await this.findOne(wishId);
    if (!wish) throw new NotFoundException('Подарок с указанным ID не найден');
    if (dto.price && wish.offers.length > 0) {
      throw new BadRequestException(
        'Нельзя редактировать, пока существуют предложения',
      );
    }
    await this.wishRepository.update(wishId, dto);
  }

  async deleteOne(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }
    if (wish.owner.id !== userId) {
      throw new BadRequestException('Запрещается удалять чужой подарок');
    }
    await this.wishRepository.delete(wishId);
    return wish;
  }

  async copy(wishId: number, userId: number): Promise<Wish> {
    const { id, copied, ...data } = await this.findOne(wishId);
    const owner = await this.userService.findUserById(userId);
    await this.wishRepository.update(id, { copied: copied + 1 });
    return this.wishRepository.save({
      ...data,
      owner,
    });
  }
}
