import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum InventoryCategory {
  FRESH_MILK = 'FRESH_MILK',
  PROCESSING = 'PROCESSING',
  STORED = 'STORED',
}

export enum InventoryStatus {
  COLD = 'COLD',
  HOT = 'HOT',
  PROCESS = 'PROCESS',
}

export class CreateInventoryItemDto {
  @ApiProperty({ description: 'ID del lote' })
  @IsNotEmpty()
  @IsString()
  batchId: string;

  @ApiProperty({ description: 'Cantidad en litros', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ enum: InventoryCategory, description: 'Categoría del inventario' })
  @IsNotEmpty()
  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @ApiProperty({ enum: InventoryStatus, description: 'Estado del inventario' })
  @IsNotEmpty()
  @IsEnum(InventoryStatus)
  status: InventoryStatus;

  @ApiProperty({ description: 'ID del ordeño relacionado', required: false })
  @IsOptional()
  @IsString()
  milkingId?: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
