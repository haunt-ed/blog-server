import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TokensService],
  controllers: [],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('REFRESH_SECRET'),
      }),
    }),
    ConfigModule,
    PrismaModule,
  ],
  exports: [TokensService],
})
export class TokensModule {}
