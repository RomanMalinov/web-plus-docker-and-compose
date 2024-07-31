import { IsEmail, IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  @IsString()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
