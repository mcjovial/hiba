import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/common/guards/jwt-authentication.guard';
import JwtRefreshGuard from 'src/common/guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from 'src/common/guards/localAuthentication.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import CreateUserDto from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  async register(@Body() registrationData: CreateUserDto) {
    const user = await this.authService.register(registrationData);
    const access_token = this.authService.getJwtAccessToken(user.id);
    const refresh_token = this.authService.getJwtRefreshToken(user.id);
    return { access_token, refresh_token, user };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('sign-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const access_token = this.authService.getJwtAccessToken(user.id);
    const refresh_token = this.authService.getJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refresh_token, user.id);

    return { access_token, refresh_token, user };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const jwtToken = this.authService.getJwtAccessToken(request.user.id);

    return { user: request.user, jwtToken };
  }
}
