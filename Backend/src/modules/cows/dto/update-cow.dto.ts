import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCowDto {
  @ApiProperty({ example: 'Margarita', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Holstein', required: false })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiProperty({ example: 'Lactante', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
