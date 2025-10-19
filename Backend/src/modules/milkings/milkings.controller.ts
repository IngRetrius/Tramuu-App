import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MilkingsService } from './milkings.service';
import { CreateMilkingRapidDto } from './dto/create-milking-rapid.dto';
import { CreateMilkingIndividualDto } from './dto/create-milking-individual.dto';
import { CreateMilkingMassiveDto } from './dto/create-milking-massive.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('milkings')
@ApiBearerAuth()
@Controller('milkings')
export class MilkingsController {
  constructor(private readonly milkingsService: MilkingsService) {}

  @Post('rapid')
  @ApiOperation({ summary: 'Crear ordeño rápido' })
  @ApiResponse({ status: 201, description: 'Ordeño rápido creado' })
  async createRapid(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('employeeId') employeeId: string,
    @Body() dto: CreateMilkingRapidDto,
  ) {
    return this.milkingsService.createRapid(companyId, employeeId, dto);
  }

  @Post('individual')
  @ApiOperation({ summary: 'Crear ordeño individual (con trazabilidad por vaca)' })
  @ApiResponse({ status: 201, description: 'Ordeño individual creado' })
  async createIndividual(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('employeeId') employeeId: string,
    @Body() dto: CreateMilkingIndividualDto,
  ) {
    return this.milkingsService.createIndividual(companyId, employeeId, dto);
  }

  @Post('massive')
  @ApiOperation({ summary: 'Crear ordeño masivo (múltiples vacas, litros totales)' })
  @ApiResponse({ status: 201, description: 'Ordeño masivo creado' })
  async createMassive(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('employeeId') employeeId: string,
    @Body() dto: CreateMilkingMassiveDto,
  ) {
    return this.milkingsService.createMassive(companyId, employeeId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ordeños' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrar por fecha (YYYY-MM-DD)' })
  @ApiQuery({ name: 'shift', required: false, description: 'Filtrar por turno (AM/PM)' })
  @ApiQuery({ name: 'employeeId', required: false, description: 'Filtrar por empleado' })
  @ApiResponse({ status: 200, description: 'Lista de ordeños' })
  async findAll(@CurrentUser('companyId') companyId: string, @Query() filters: any) {
    return this.milkingsService.findAll(companyId, filters);
  }

  @Get('cow/:cowId/history')
  @ApiOperation({ summary: 'Historial completo de ordeños de una vaca' })
  @ApiResponse({ status: 200, description: 'Historial de vaca' })
  async getCowHistory(@Param('cowId') cowId: string, @CurrentUser('companyId') companyId: string) {
    return this.milkingsService.getCowHistory(cowId, companyId);
  }

  @Get('employee/:employeeId/history')
  @ApiOperation({ summary: 'Historial de ordeños registrados por un empleado' })
  @ApiResponse({ status: 200, description: 'Historial de empleado' })
  async getEmployeeHistory(
    @Param('employeeId') employeeId: string,
    @CurrentUser('companyId') companyId: string,
  ) {
    return this.milkingsService.getEmployeeHistory(employeeId, companyId);
  }

  @Get('stats/daily')
  @ApiOperation({ summary: 'Estadísticas diarias de producción' })
  @ApiQuery({ name: 'date', required: true, description: 'Fecha (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Estadísticas diarias' })
  async getDailyStats(@CurrentUser('companyId') companyId: string, @Query('date') date: string) {
    return this.milkingsService.getDailyStats(companyId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un ordeño' })
  @ApiResponse({ status: 200, description: 'Ordeño encontrado' })
  @ApiResponse({ status: 404, description: 'Ordeño no encontrado' })
  async findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.milkingsService.findOne(id, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ordeño' })
  @ApiResponse({ status: 200, description: 'Ordeño eliminado' })
  async remove(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.milkingsService.remove(id, companyId);
  }
}
