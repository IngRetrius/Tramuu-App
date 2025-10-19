import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateDeliveryDto {
  @ApiProperty({ description: 'Nombre del cliente' })
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @ApiProperty({ description: 'Email del cliente', required: false })
  @IsOptional()
  @IsString()
  clientEmail?: string;

  @ApiProperty({ description: 'Teléfono del cliente', required: false })
  @IsOptional()
  @IsString()
  clientPhone?: string;

  @ApiProperty({ description: 'Dirección de entrega' })
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ description: 'Cantidad en litros', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Fecha programada de entrega' })
  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ description: 'Hora programada (HH:mm)', required: false })
  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @ApiProperty({ description: 'ID del empleado asignado (lechero)', required: false })
  @IsOptional()
  @IsString()
  assignedEmployeeId?: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
