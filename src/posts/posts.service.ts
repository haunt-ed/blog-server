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

  async getAllPosts({ take, skip, sortBy, order }) {
    const searchConfig: any = {
      include: { likes: true, comments: true },
    };

    if (!isNaN(take)) {
      searchConfig.take = take;
    }
    if (!isNaN(skip)) {
      searchConfig.skip = skip;
    }
    if (sortBy) {
      searchConfig.orderBy = { [sortBy]: order === 'desc' ? order : 'asc' };
    }
    if (sortBy === 'likes') {
      searchConfig.orderBy = {
        [sortBy]: { _count: order === 'desc' ? order : 'asc' },
      };
    }

    try {
      const posts = await this.prisma.post.findMany(searchConfig);
      return posts;
    } catch (error) {
      throw new HttpException(
        'Something went wrong during sorting',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserPosts(authorId: number) {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
      include: { likes: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });
    return posts;
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findFirst({
      where: { id },
      include: { likes: true, comments: true },
    });
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
      include: { likes: true, comments: true },
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
      include: { likes: true, comments: true },
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

    await this.prisma.likes.deleteMany({ where: { postId } });
    await this.prisma.post.delete({ where: { id: postId } });
  }

  async likePost(token: string, postId: number) {
    const userData = this.tokensService.validateAccessToken(token);
    const post = await this.prisma.post.findFirst({
      where: { id: postId },
      include: {
        _count: {
          select: { likes: { where: { userId: userData.id } } },
        },
      },
    });

    if (post._count.likes === 0) {
      const like = await this.prisma.likes.create({
        data: { userId: userData.id, postId: post.id },
      });
      return like;
    }

    await this.prisma.likes.delete({
      where: { postId_userId: { postId: post.id, userId: userData.id } },
    });
  }
}
