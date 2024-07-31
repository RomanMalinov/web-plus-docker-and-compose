import { IsEmail, IsString, IsUrl, IsOptional } from 'class-validator';

export class authDto {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
