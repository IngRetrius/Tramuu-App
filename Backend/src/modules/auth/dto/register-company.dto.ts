import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterCompanyDto {
  @ApiProperty({ example: 'Lácteos S.A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '800197268-4' })
  @IsString()
  @IsNotEmpty()
  nitId: string;

  @ApiProperty({ example: 'Cra 2 Bis Cl 22', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '3145442377', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'admin@lacteos.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
