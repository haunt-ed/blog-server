import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiProperty()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  content?: string;
}
