import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
