import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePostDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
