import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QualityService } from './quality.service';
import { CreateQualityTestDto } from './dto/create-quality-test.dto';
import { UpdateQualityTestDto } from './dto/update-quality-test.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('quality')
@ApiBearerAuth()
@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Post('tests')
  @ApiOperation({ summary: 'Crear prueba de calidad' })
  @ApiResponse({ status: 201, description: 'Prueba creada' })
  async create(@CurrentUser('companyId') companyId: string, @Body() dto: CreateQualityTestDto) {
    return this.qualityService.create(companyId, dto);
  }

  @Get('tests')
  @ApiOperation({ summary: 'Obtener todas las pruebas de calidad' })
  @ApiResponse({ status: 200, description: 'Lista de pruebas' })
  async findAll(@CurrentUser('companyId') companyId: string) {
    return this.qualityService.findAll(companyId);
  }

  @Get('tests/:id')
  @ApiOperation({ summary: 'Obtener una prueba de calidad' })
  @ApiResponse({ status: 200, description: 'Prueba encontrada' })
  async findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.qualityService.findOne(id, companyId);
  }

  @Put('tests/:id')
  @ApiOperation({ summary: 'Actualizar prueba de calidad' })
  @ApiResponse({ status: 200, description: 'Prueba actualizada' })
  async update(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() dto: UpdateQualityTestDto,
  ) {
    return this.qualityService.update(id, companyId, dto);
  }

  @Delete('tests/:id')
  @ApiOperation({ summary: 'Eliminar prueba de calidad' })
  @ApiResponse({ status: 200, description: 'Prueba eliminada' })
  async remove(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.qualityService.remove(id, companyId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de calidad' })
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  async getStats(@CurrentUser('companyId') companyId: string) {
    return this.qualityService.getStats(companyId);
  }
}
