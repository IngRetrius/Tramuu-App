import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener información de mi empresa' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  async getMyCompany(@CurrentUser('sub') userId: string, @CurrentUser('userType') userType: string) {
    return this.companiesService.getMyCompany(userId, userType);
  }

  @Put('me')
  @ApiOperation({ summary: 'Actualizar información de mi empresa' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada' })
  async updateMyCompany(
    @CurrentUser('sub') userId: string,
    @CurrentUser('userType') userType: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateMyCompany(userId, userType, dto);
  }

  @Post('generate-code')
  @ApiOperation({ summary: 'Generar nuevo código de invitación' })
  @ApiResponse({ status: 200, description: 'Código generado' })
  async generateCode(@CurrentUser('sub') userId: string, @CurrentUser('userType') userType: string) {
    return this.companiesService.generateNewInvitationCode(userId, userType);
  }
}
