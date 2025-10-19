import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCowDto {
  @ApiProperty({ example: 'C-001' })
  @IsString()
  @IsNotEmpty()
  cowId: string;

  @ApiProperty({ example: 'Margarita', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Holstein' })
  @IsString()
  @IsNotEmpty()
  breed: string;

  @ApiProperty({ example: 'Lactante' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
