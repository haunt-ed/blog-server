import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private tokensService: TokensService,
  ) {}

  getCommentsByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  getCommentAmount(postId: number) {
    return this.prisma.comment.count({ where: { postId } });
  }

  getCommentById(id: number) {
    return this.prisma.comment.findFirst({ where: { id } });
  }

  async createComment(dto: CreateCommentDto, token: string) {
    const userData = this.tokensService.validateAccessToken(token);

    const comment = this.prisma.comment.create({
      data: { ...dto, authorId: userData.id },
      include: { author: { select: { username: true } } },
    });
    return comment;
  }

  async updateComment(dto: UpdateCommentDto, token: string) {
    const comment = await this.getCommentById(dto.id);
    const userData = this.tokensService.validateAccessToken(token);

    if (comment.authorId !== userData.id) {
      throw new HttpException(
        'Not allowed to edit comment',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prisma.comment.update({
      where: { id: comment.id },
      data: { content: dto.content },
    });
  }

  async deleteComment(id: number, token: string) {
    const comment = await this.getCommentById(id);
    const userData = this.tokensService.validateAccessToken(token);

    if (comment.authorId !== userData.id) {
      throw new HttpException(
        'Not allowed to delete comment',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
