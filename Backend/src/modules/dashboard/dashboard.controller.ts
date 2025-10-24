import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen del dashboard' })
  @ApiResponse({ status: 200, description: 'Resumen del dashboard' })
  async getSummary(@CurrentUser('companyId') companyId: string) {
    return this.dashboardService.getSummary(companyId);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Obtener métricas del dashboard' })
  @ApiResponse({ status: 200, description: 'Métricas del dashboard' })
  async getMetrics(@CurrentUser('companyId') companyId: string) {
    return this.dashboardService.getMetrics(companyId);
  }

  @Get('production')
  @ApiOperation({ summary: 'Obtener datos de producción por período' })
  @ApiQuery({ name: 'period', required: false, enum: ['day', 'week', 'month'], description: 'Período de tiempo para los datos de producción' })
  @ApiResponse({ status: 200, description: 'Datos de producción por período' })
  async getProduction(
    @CurrentUser('companyId') companyId: string,
    @Query('period') period: 'day' | 'week' | 'month' = 'week',
  ) {
    return this.dashboardService.getProductionByPeriod(companyId, period);
  }
}
