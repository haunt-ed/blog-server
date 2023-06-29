import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [PrismaModule, TokensModule],
})
export class PostsModule {}
