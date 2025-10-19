import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('employees')
@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los empleados de la empresa' })
  @ApiResponse({ status: 200, description: 'Lista de empleados' })
  async findAll(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('userType') userType: string,
  ) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden listar empleados');
    }
    return this.employeesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.employeesService.findOne(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  @ApiResponse({ status: 201, description: 'Empleado creado' })
  async create(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('userType') userType: string,
    @Body() dto: CreateEmployeeDto,
  ) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden crear empleados');
    }
    return this.employeesService.create(companyId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un empleado' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado' })
  async update(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('userType') userType: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden actualizar empleados');
    }
    return this.employeesService.update(id, companyId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un empleado' })
  @ApiResponse({ status: 200, description: 'Empleado eliminado' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('userType') userType: string,
  ) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden eliminar empleados');
    }
    return this.employeesService.remove(id, companyId);
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Activar/desactivar un empleado' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async toggleStatus(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('userType') userType: string,
  ) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden cambiar el estado de empleados');
    }
    return this.employeesService.toggleStatus(id, companyId);
  }
}
