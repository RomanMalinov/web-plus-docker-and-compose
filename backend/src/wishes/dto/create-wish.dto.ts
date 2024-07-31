import { IsString, IsUrl, Length, IsNumber, Min } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsString()
  link: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
