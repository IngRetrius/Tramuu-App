import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '3201234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
