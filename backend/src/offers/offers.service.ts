import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, userId: number) {
    const wish = await this.wishesService.findOne(dto.itemId);
    const user = await this.usersService.findUserById(userId);
    if (user.id === wish.owner.id) {
      throw new ForbiddenException(
        'Самостоятельное финансирование ваших подарков запрещено',
      );
    }
    if (wish.raised + dto.amount > wish.price) {
      throw new ForbiddenException(
        'Сумма вашего предложения не должна превышать стоимость, необходимую для полного финансирования подарка',
      );
    }
    await this.wishesService.update(dto.itemId, {
      raised: Number(wish.raised) + Number(dto.amount),
    } as UpdateWishDto);
    return this.offerRepository.save({
      ...dto,
      user,
      item: wish,
    });
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
    });
    if (!offer) {
      throw new NotFoundException(`Offer с таким id не найден`);
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: ['user', 'item'],
    });
  }
}
