import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Crear item de inventario' })
  @ApiResponse({ status: 201, description: 'Item creado' })
  async create(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('employeeId') employeeId: string,
    @Body() dto: CreateInventoryItemDto,
  ) {
    return this.inventoryService.createItem(companyId, employeeId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los items de inventario' })
  @ApiResponse({ status: 200, description: 'Lista de items' })
  async findAll(@CurrentUser('companyId') companyId: string) {
    return this.inventoryService.findAll(companyId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de inventario' })
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  async getStats(@CurrentUser('companyId') companyId: string) {
    return this.inventoryService.getStats(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item de inventario' })
  @ApiResponse({ status: 200, description: 'Item encontrado' })
  async findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.inventoryService.findOne(id, companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar item de inventario' })
  @ApiResponse({ status: 200, description: 'Item actualizado' })
  async update(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(id, companyId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar item de inventario' })
  @ApiResponse({ status: 200, description: 'Item eliminado' })
  async remove(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.inventoryService.remove(id, companyId);
  }

  // Inventory Movements Endpoints
  @Post('movements')
  @ApiOperation({ summary: 'Crear movimiento de inventario' })
  @ApiResponse({ status: 201, description: 'Movimiento creado' })
  async createMovement(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('employeeId') employeeId: string,
    @Body() dto: CreateInventoryMovementDto,
  ) {
    return this.inventoryService.createMovement(companyId, employeeId, dto);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Obtener movimientos de inventario' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos' })
  @ApiQuery({ name: 'inventoryItemId', required: false })
  async getMovements(
    @CurrentUser('companyId') companyId: string,
    @Query('inventoryItemId') inventoryItemId?: string,
  ) {
    return this.inventoryService.getMovements(companyId, inventoryItemId);
  }
}
