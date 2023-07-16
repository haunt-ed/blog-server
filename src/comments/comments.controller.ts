import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/:postId')
  getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPostId(+postId);
  }

  @Get('/amount/:postId')
  getCommentsAmount(@Param('postId') postId: string) {
    return this.commentsService.getCommentAmount(+postId);
  }

  @Post('/create')
  createComment(@Body() dto: CreateCommentDto, @Req() req: Request) {
    const token = this.getToken(req);
    return this.commentsService.createComment(dto, token);
  }

  @Post('/update')
  updateComment(@Body() dto: UpdateCommentDto, @Req() req: Request) {
    const token = this.getToken(req);
    return this.commentsService.updateComment(dto, token);
  }

  @Delete()
  deleteComment(
    @Body() dto: Omit<UpdateCommentDto, 'content'>,
    @Req() req: Request,
  ) {
    const token = this.getToken(req);
    return this.commentsService.deleteComment(dto.id, token);
  }

  private getToken(req: Request): string {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    return token;
  }
}
