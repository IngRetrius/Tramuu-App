import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsDateString,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CowMilkingDto {
  @ApiProperty({ example: 'uuid-cow-id' })
  @IsUUID()
  cowId: string;

  @ApiProperty({ example: 18.5 })
  @IsNumber()
  @Min(0)
  liters: number;
}

export class CreateMilkingIndividualDto {
  @ApiProperty({ example: 'AM', enum: ['AM', 'PM'] })
  @IsIn(['AM', 'PM'])
  shift: string;

  @ApiProperty({ type: [CowMilkingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CowMilkingDto)
  cows: CowMilkingDto[];

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  milkingDate: string;

  @ApiProperty({ example: '05:30' })
  @IsString()
  milkingTime: string;

  @ApiProperty({ example: 'Ordeño individual', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
