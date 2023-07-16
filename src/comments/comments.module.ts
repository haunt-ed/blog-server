import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [PrismaModule, TokensModule],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
