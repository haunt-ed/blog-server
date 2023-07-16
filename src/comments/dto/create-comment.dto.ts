import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
