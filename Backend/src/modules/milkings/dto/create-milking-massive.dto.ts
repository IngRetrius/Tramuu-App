import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsArray, IsUUID, IsNumber, IsDateString, IsString, IsOptional, Min } from 'class-validator';

export class CreateMilkingMassiveDto {
  @ApiProperty({ example: 'AM', enum: ['AM', 'PM'] })
  @IsIn(['AM', 'PM'])
  shift: string;

  @ApiProperty({ example: ['uuid-cow-1', 'uuid-cow-2'], type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  cowIds: string[];

  @ApiProperty({ example: 450.0 })
  @IsNumber()
  @Min(0)
  totalLiters: number;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  milkingDate: string;

  @ApiProperty({ example: '05:30' })
  @IsString()
  milkingTime: string;

  @ApiProperty({ example: 'Ordeño masivo', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
