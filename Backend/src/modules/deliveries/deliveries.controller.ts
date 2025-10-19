import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto, DeliveryStatus } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('deliveries')
@ApiBearerAuth()
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear entrega' })
  @ApiResponse({ status: 201, description: 'Entrega creada' })
  async create(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('employeeId') employeeId: string,
    @Body() dto: CreateDeliveryDto,
  ) {
    return this.deliveriesService.create(companyId, employeeId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las entregas' })
  @ApiResponse({ status: 200, description: 'Lista de entregas' })
  @ApiQuery({ name: 'status', required: false, enum: DeliveryStatus })
  @ApiQuery({ name: 'date', required: false })
  async findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('status') status?: DeliveryStatus,
    @Query('date') date?: string,
  ) {
    return this.deliveriesService.findAll(companyId, status, date);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de entregas' })
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  async getStats(@CurrentUser('companyId') companyId: string) {
    return this.deliveriesService.getStats(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una entrega' })
  @ApiResponse({ status: 200, description: 'Entrega encontrada' })
  async findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.deliveriesService.findOne(id, companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar entrega' })
  @ApiResponse({ status: 200, description: 'Entrega actualizada' })
  async update(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateDeliveryDto,
  ) {
    return this.deliveriesService.update(id, companyId, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de entrega' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body('status') status: DeliveryStatus,
  ) {
    return this.deliveriesService.updateStatus(id, companyId, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  async remove(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.deliveriesService.remove(id, companyId);
  }
}
