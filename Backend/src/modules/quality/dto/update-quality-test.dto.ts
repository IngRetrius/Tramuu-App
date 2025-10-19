import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateQualityTestDto {
  @ApiProperty({ example: 3.8, required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  fatPercentage?: number;

  @ApiProperty({ example: 3.2, required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  proteinPercentage?: number;

  @ApiProperty({ example: 50000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  ufc?: number;

  @ApiProperty({ example: 'Buena calidad', required: false })
  @IsString()
  @IsOptional()
  observations?: string;
}
