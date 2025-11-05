import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register/company')
  @ApiOperation({ summary: 'Registrar una nueva empresa' })
  @SwaggerResponse({ status: 201, description: 'Empresa registrada exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o email/NIT ya existe' })
  async registerCompany(@Body() dto: RegisterCompanyDto) {
    return this.authService.registerCompany(dto);
  }

  @Public()
  @Post('register/employee')
  @ApiOperation({ summary: 'Registrar un nuevo empleado' })
  @SwaggerResponse({ status: 201, description: 'Empleado registrado exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o código de invitación inválido' })
  async registerEmployee(@Body() dto: RegisterEmployeeDto) {
    return this.authService.registerEmployee(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @SwaggerResponse({ status: 200, description: 'Login exitoso' })
  @SwaggerResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar access token' })
  @SwaggerResponse({ status: 200, description: 'Token refrescado exitosamente' })
  @SwaggerResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Public()
  @Get('verify-code/:code')
  @ApiOperation({ summary: 'Verificar código de invitación' })
  @SwaggerResponse({ status: 200, description: 'Código válido' })
  @SwaggerResponse({ status: 400, description: 'Código inválido' })
  async verifyCode(@Param('code') code: string) {
    return this.authService.verifyInvitationCode(code);
  }

  @Put('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @SwaggerResponse({ status: 200, description: 'Contraseña actualizada' })
  @SwaggerResponse({ status: 400, description: 'Error al actualizar contraseña' })
  @SwaggerResponse({ status: 401, description: 'Contraseña actual incorrecta' })
  async changePassword(@CurrentUser('sub') userId: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }
}
