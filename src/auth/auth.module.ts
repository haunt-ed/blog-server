import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [PrismaModule, UsersModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
