import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Request, Response } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('/:userId')
  getUserPosts(@Param('userId') id: string) {
    return this.postsService.getUserPosts(+id);
  }

  @Post('/create')
  createPost(@Body() dto: CreatePostDto, @Req() req: Request) {
    const token = this.getRefreshToken(req);
    return this.postsService.createPost(token, dto);
  }

  @Post('/update')
  updatePost(@Body() dto: UpdatePostDto, @Req() req: Request) {
    const token = this.getRefreshToken(req);
    return this.postsService.updatePost(token, dto);
  }

  @Delete()
  async deletePost(
    @Body() body: DeletePostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { postId } = body;
    const token = this.getRefreshToken(req);
    await this.postsService.deletePost(token, postId);
    res.sendStatus(204);
  }

  getRefreshToken(req: Request): string {
    const { cookies } = req;
    return cookies.refreshToken || '';
  }
}
