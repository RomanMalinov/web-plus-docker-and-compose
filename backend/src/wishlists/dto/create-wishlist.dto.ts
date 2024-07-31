import { IsArray, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsArray()
  itemsId: number[];

  @IsString()
  @Length(1, 1500)
  description?: string;
}
