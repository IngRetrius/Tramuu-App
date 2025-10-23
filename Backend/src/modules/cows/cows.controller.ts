import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CowsService } from './cows.service';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('cows')
@ApiBearerAuth()
@Controller('cows')
export class CowsController {
  constructor(private readonly cowsService: CowsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las vacas' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por ID o nombre de vaca' })
  @ApiQuery({ name: 'breed', required: false, description: 'Filtrar por raza' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filtrar por vacas activas/inactivas' })
  @ApiResponse({ status: 200, description: 'Lista de vacas' })
  async findAll(@CurrentUser('companyId') companyId: string, @Query() filters: any) {
    return this.cowsService.findAll(companyId, filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar vacas por ID o nombre' })
  @ApiQuery({ name: 'q', description: 'Texto de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  async search(@CurrentUser('companyId') companyId: string, @Query('q') query: string) {
    return this.cowsService.search(companyId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de vacas' })
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  async getStats(@CurrentUser('companyId') companyId: string) {
    return this.cowsService.getStats(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una vaca por ID' })
  @ApiResponse({ status: 200, description: 'Vaca encontrada' })
  @ApiResponse({ status: 404, description: 'Vaca no encontrada' })
  async findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.cowsService.findOne(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva vaca' })
  @ApiResponse({ status: 201, description: 'Vaca creada' })
  async create(@CurrentUser('companyId') companyId: string, @Body() dto: CreateCowDto) {
    return this.cowsService.create(companyId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una vaca' })
  @ApiResponse({ status: 200, description: 'Vaca actualizada' })
  async update(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateCowDto,
  ) {
    return this.cowsService.update(id, companyId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una vaca' })
  @ApiResponse({ status: 200, description: 'Vaca desactivada' })
  async remove(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.cowsService.remove(id, companyId);
  }
}
