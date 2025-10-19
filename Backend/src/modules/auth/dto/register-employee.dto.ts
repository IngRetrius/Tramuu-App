import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterEmployeeDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ABCD1234', description: 'Código de invitación de la empresa' })
  @IsString()
  @IsNotEmpty()
  invitationCode: string;

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
