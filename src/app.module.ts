import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from './tokens/tokens.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, ConfigModule, TokensModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
