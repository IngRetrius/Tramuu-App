import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsDateString, Min, Max } from 'class-validator';

export class CreateQualityTestDto {
  @ApiProperty({ example: 'TEST-001' })
  @IsString()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({ example: 'uuid-milking-id', required: false })
  @IsUUID()
  @IsOptional()
  milkingId?: string;

  @ApiProperty({ example: 3.8 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  fatPercentage?: number;

  @ApiProperty({ example: 3.2 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  proteinPercentage?: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  ufc?: number;

  @ApiProperty({ example: 'Buena calidad', required: false })
  @IsString()
  @IsOptional()
  observations?: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  testDate: string;
}
