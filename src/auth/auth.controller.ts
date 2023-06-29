import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { TOKENS_AGE } from 'src/helpers/tokensAge';
import { CreateTokensResponse } from 'src/types/tokens.types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/sign-up')
  async signUpLocal(@Body() dto: CreateUserDto, @Res() res: Response) {
    const tokens = await this.authService.signUpLocal(dto);

    this.setRefreshToken(res, tokens);
  }

  @Post('/local/sign-in')
  async signInLocal(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.signInLocal(dto);

    this.setRefreshToken(res, tokens);
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const { cookies } = req;
    const refreshToken = cookies.refreshToken || '';

    await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken');
    res.sendStatus(204);
  }

  @Post('/refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const { cookies } = req;
    console.log(req);
    const refreshToken = cookies.refreshToken || '';

    const tokens = await this.authService.refreshTokens(refreshToken);

    this.setRefreshToken(res, tokens);
  }

  setRefreshToken(res: Response, tokens: CreateTokensResponse) {
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: TOKENS_AGE.refresh,
      httpOnly: true,
    });

    res.json(tokens);
  }
}
