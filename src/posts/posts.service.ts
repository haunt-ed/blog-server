import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private tokensService: TokensService,
  ) {}

  async getAllPosts() {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  async getUserPosts(authorId: number) {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
    return posts;
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findFirst({ where: { id } });
    return post;
  }

  async createPost(token: string, dto: CreatePostDto) {
    const userData = this.tokensService.validateAccessToken(token);
    if (!userData) {
      throw new UnauthorizedException();
    }

    const { title, content } = dto;

    const post = this.prisma.post.create({
      data: {
        authorId: userData.id,
        title,
        content,
      },
    });
    return post;
  }

  async updatePost(token: string, dto: UpdatePostDto) {
    const userData = this.tokensService.validateAccessToken(token);
    const post = await this.getPostById(dto.postId);

    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.BAD_REQUEST);
    }

    if (!userData || post.authorId !== userData.id) {
      throw new UnauthorizedException();
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: post.id },
      data: {
        title: dto.title || post.title,
        content: dto.content || post.content,
      },
    });

    return updatedPost;
  }

  async deletePost(token: string, postId: number) {
    const userData = this.tokensService.validateAccessToken(token);
    const post = await this.getPostById(postId);

    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.BAD_REQUEST);
    }

    if (!userData || post.authorId !== userData.id) {
      throw new UnauthorizedException();
    }

    await this.prisma.post.delete({ where: { id: postId } });
  }
}
