import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  async signUpLocal(dto: CreateUserDto) {
    await this.checkForUniqueness(dto.email, dto.username);

    const hashPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      ...dto,
      password: hashPassword,
    });
    return await this.saveTokenToDb(user);
  }

  async signInLocal(dto: LoginDto) {
    const userData =
      (await this.usersService.getUserByEmail(dto.user)) ||
      (await this.usersService.getUserByUsername(dto.user));

    if (!userData) {
      throw new HttpException(
        'Accout does not exists or password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const comparedPassword = await bcrypt.compare(
      dto.password,
      userData.password,
    );

    if (!comparedPassword) {
      throw new HttpException(
        'Accout does not exists or password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.saveTokenToDb(userData);
  }

  async logout(token: string) {
    await this.tokensService.removeToken(token);
  }

  async refreshTokens(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }

    const userData = this.tokensService.validateRefreshToken(token);
    const tokenData = await this.tokensService.findToken(token);

    if (!userData || !tokenData) {
      throw new UnauthorizedException();
    }

    return await this.saveTokenToDb(userData);
  }

  async saveTokenToDb(user: UserDto) {
    const userData = await this.usersService.getUserByEmail(user.email);
    const userDto: UserDto = {
      email: user.email,
      username: user.username,
    };

    const tokens = this.tokensService.generateTokens(userDto);
    await this.tokensService.saveToken(userData.id, tokens.refreshToken);

    return tokens;
  }

  async checkForUniqueness(email: string, username: string) {
    const candidateByEmail = await this.usersService.getUserByEmail(email);
    const candidateByUsername = await this.usersService.getUserByUsername(
      username,
    );

    if (candidateByEmail) {
      throw new HttpException(
        'User with this email is already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (candidateByUsername) {
      throw new HttpException(
        'User with this username is already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
