import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('offers')
@UseGuards(ThrottlerGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() { user }: { user: User },
  ) {
    return this.offersService.create(createOfferDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
