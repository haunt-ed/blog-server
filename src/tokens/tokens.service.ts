import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTokensResponse } from 'src/types/tokens.types';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class TokensService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  generateTokens(payload: any): CreateTokensResponse {
    const accessSecret = this.config.get<string>('ACCESS_SECRET');

    const refreshToken = this.jwtService.sign(
      { ...payload },
      { expiresIn: '30d' },
    );
    const accessToken = this.jwtService.sign(
      { ...payload },
      { expiresIn: '1h', secret: accessSecret },
    );

    return {
      refreshToken,
      accessToken,
    };
  }

  validateRefreshToken(token: string): UserDto {
    try {
      const userData = this.jwtService.verify(token);
      return userData;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  validateAccessToken(token: string) {
    try {
      const accessSecret = this.config.get<string>('ACCESS_SECRET');
      const userData = this.jwtService.verify(token, { secret: accessSecret });
      return userData;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async saveToken(userId: number, refreshToken: string) {
    const token = await this.prisma.token.findFirst({ where: { userId } });

    if (token) {
      await this.prisma.token.update({
        where: { userId },
        data: { userId, token: refreshToken },
      });

      return this.findToken(refreshToken);
    }

    const newToken = this.prisma.token.create({
      data: {
        token: refreshToken,
        userId,
      },
    });

    return newToken;
  }

  async removeToken(token: string) {
    const tokenData = await this.prisma.token.findFirst({ where: { token } });
    await this.prisma.token.delete({ where: { userId: tokenData.userId } });
  }

  async findToken(token: string) {
    return await this.prisma.token.findFirst({ where: { token } });
  }
}
