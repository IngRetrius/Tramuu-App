import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
}
