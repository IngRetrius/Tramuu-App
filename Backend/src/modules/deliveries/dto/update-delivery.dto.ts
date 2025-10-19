import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DeliveryStatus } from './create-delivery.dto';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {
  @ApiProperty({ enum: DeliveryStatus, description: 'Estado de la entrega', required: false })
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;
}
