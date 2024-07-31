import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
import { LocalGuard } from '../guards/local.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() signUpDto: authDto) {
    return this.authService.signup(signUpDto);
  }
}
