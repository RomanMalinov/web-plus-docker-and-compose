import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  itemId: number;

  @IsBoolean()
  hidden: boolean;
}
