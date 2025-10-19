import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({ example: 'Lácteos S.A', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Cra 2 Bis Cl 22', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '3145442377', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}
