import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { id: true, username: true, email: true },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findFirst({ where: { username } });
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
      },
    });

    return newUser;
  }
}
