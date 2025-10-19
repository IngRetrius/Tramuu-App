import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export class CreateInventoryMovementDto {
  @ApiProperty({ description: 'ID del item de inventario' })
  @IsNotEmpty()
  @IsString()
  inventoryItemId: string;

  @ApiProperty({ enum: MovementType, description: 'Tipo de movimiento' })
  @IsNotEmpty()
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ description: 'Cantidad en litros', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Razón del movimiento' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
