import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsDateString, Min, Max } from 'class-validator';

export class CreateQualityTestDto {
  @ApiProperty({ example: 3.8, description: 'Porcentaje de grasa' })
  @IsNumber()
  @Min(0)
  @Max(100)
  fat: number;

  @ApiProperty({ example: 3.2, description: 'Porcentaje de proteína' })
  @IsNumber()
  @Min(0)
  @Max(100)
  protein: number;

  @ApiProperty({ example: 4.8, description: 'Porcentaje de lactosa' })
  @IsNumber()
  @Min(0)
  @Max(100)
  lactose: number;

  @ApiProperty({ example: 50000, description: 'Unidades Formadoras de Colonias' })
  @IsNumber()
  @Min(0)
  ufc: number;

  @ApiProperty({ example: 6.8, description: 'Acidez (pH)' })
  @IsNumber()
  @Min(0)
  @Max(14)
  acidity: number;

  @ApiProperty({ example: 'Buena calidad', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'base64-image-string', required: false })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({ example: '2025-01-15', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 'uuid-milking-id', required: false })
  @IsUUID()
  @IsOptional()
  milkingId?: string;
}
