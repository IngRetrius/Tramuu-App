import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsString()
  @IsOptional()
  documentId?: string;

  @ApiProperty({ example: '3201234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}
