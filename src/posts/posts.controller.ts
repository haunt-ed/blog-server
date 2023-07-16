import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({})
  getAllPosts(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'desc' | 'asc',
  ) {
    return this.postsService.getAllPosts({
      skip: Number(skip),
      take: Number(take),
      sortBy,
      order,
    });
  }

  @Get('/:userId')
  getUserPosts(@Param('userId') id: string) {
    return this.postsService.getUserPosts(+id);
  }

  @Post('/create')
  createPost(@Body() dto: CreatePostDto, @Req() req: Request) {
    const token = this.getToken(req);
    return this.postsService.createPost(token, dto);
  }

  @Post('/update')
  updatePost(@Body() dto: UpdatePostDto, @Req() req: Request) {
    const token = this.getToken(req);
    return this.postsService.updatePost(token, dto);
  }

  @Delete()
  async deletePost(
    @Body() body: DeletePostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { postId } = body;
    const token = this.getToken(req);
    await this.postsService.deletePost(token, postId);
    res.sendStatus(204);
  }

  @Post('/like/:postId')
  async likePost(
    @Param('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = this.getToken(req);
    const like = await this.postsService.likePost(token, +postId);
    if (like) {
      res.json(like);
    }
    res.sendStatus(204);
  }

  private getToken(req: Request): string {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    return token;
  }
}
