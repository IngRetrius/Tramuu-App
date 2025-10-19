import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber, IsDateString, IsString, IsOptional, Min } from 'class-validator';

export class CreateMilkingRapidDto {
  @ApiProperty({ example: 'AM', enum: ['AM', 'PM'] })
  @IsIn(['AM', 'PM'])
  shift: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(1)
  cowCount: number;

  @ApiProperty({ example: 520.5 })
  @IsNumber()
  @Min(0)
  totalLiters: number;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  milkingDate: string;

  @ApiProperty({ example: '05:30' })
  @IsString()
  milkingTime: string;

  @ApiProperty({ example: 'Ordeño normal', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
