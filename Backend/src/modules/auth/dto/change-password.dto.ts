import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Nueva contraseña', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
