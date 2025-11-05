import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '@database/supabase.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async registerCompany(dto: RegisterCompanyDto) {
    const supabase = this.supabaseService.getClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    // Check if NIT already exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('nit_id', dto.nitId)
      .single();

    if (existingCompany) {
      throw new BadRequestException('El NIT ya está registrado');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: dto.email,
        password_hash: passwordHash,
        user_type: 'company',
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      throw new BadRequestException(`Error al crear usuario: ${userError.message}`);
    }

    // Generate invitation code
    const { data: codeData } = await supabase.rpc('generate_invitation_code');
    const invitationCode = codeData || this.generateInvitationCode();

    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        name: dto.name,
        nit_id: dto.nitId,
        phone: dto.phone,
        address: dto.address,
        invitation_code: invitationCode,
      })
      .select()
      .single();

    if (companyError) {
      console.error('Error creating company:', companyError);
      await supabase.from('users').delete().eq('id', user.id);
      throw new BadRequestException(`Error al crear empresa: ${companyError.message}`);
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      userType: 'company' as const,
      companyId: company.id,
    };

    const accessToken = this.generateToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        userType: 'company',
      },
      company: {
        id: company.id,
        name: company.name,
        nitId: company.nit_id,
        phone: company.phone,
        address: company.address,
        invitationCode: company.invitation_code,
      },
      accessToken,
      refreshToken,
    };
  }

  async registerEmployee(dto: RegisterEmployeeDto) {
    const supabase = this.supabaseService.getClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    // Find company by invitation code
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('invitation_code', dto.invitationCode)
      .single();

    if (companyError || !company) {
      throw new BadRequestException('Código de invitación inválido');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: dto.email,
        password_hash: passwordHash,
        user_type: 'employee',
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating employee user:', userError);
      throw new BadRequestException(`Error al crear usuario: ${userError.message}`);
    }

    // Create employee
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        user_id: user.id,
        company_id: company.id,
        name: dto.name,
        phone: dto.phone,
      })
      .select()
      .single();

    if (employeeError) {
      console.error('Error creating employee:', employeeError);
      await supabase.from('users').delete().eq('id', user.id);
      throw new BadRequestException(`Error al crear empleado: ${employeeError.message}`);
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      userType: 'employee' as const,
      companyId: company.id,
      employeeId: employee.id,
    };

    const accessToken = this.generateToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        userType: 'employee',
      },
      employee: {
        id: employee.id,
        name: employee.name,
        phone: employee.phone,
        companyId: company.id,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', dto.email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    let additionalData = {};

    // Get company or employee data
    if (user.user_type === 'company') {
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      additionalData = {
        companyId: company?.id,
        company,
      };
    } else if (user.user_type === 'employee') {
      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!employee?.is_active) {
        throw new UnauthorizedException('Empleado inactivo');
      }

      additionalData = {
        companyId: employee?.company_id,
        employeeId: employee?.id,
        employee,
      };
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      userType: user.user_type as 'company' | 'employee',
      companyId: additionalData['companyId'],
      employeeId: additionalData['employeeId'],
    };

    const accessToken = this.generateToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
      },
      ...additionalData,
      accessToken,
      refreshToken,
    };
  }

  async verifyInvitationCode(code: string) {
    const supabase = this.supabaseService.getClient();

    const { data: company, error } = await supabase
      .from('companies')
      .select('id, name')
      .eq('invitation_code', code)
      .single();

    if (error || !company) {
      throw new BadRequestException('Código de invitación inválido');
    }

    return {
      valid: true,
      company: {
        id: company.id,
        name: company.name,
      },
    };
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d',
    });
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const supabase = this.supabaseService.getClient();

      // Get user
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', payload.sub)
        .single();

      if (error || !user || !user.is_active) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
      }

      // Get additional data based on user type
      let additionalPayload = {};

      if (user.user_type === 'company') {
        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .single();

        additionalPayload = {
          companyId: company?.id,
        };
      } else if (user.user_type === 'employee') {
        const { data: employee } = await supabase
          .from('employees')
          .select('id, company_id, is_active')
          .eq('user_id', user.id)
          .single();

        if (!employee?.is_active) {
          throw new UnauthorizedException('Empleado inactivo');
        }

        additionalPayload = {
          companyId: employee?.company_id,
          employeeId: employee?.id,
        };
      }

      // Generate new access token
      const newAccessToken = this.generateToken({
        sub: user.id,
        email: user.email,
        userType: user.user_type as 'company' | 'employee',
        ...additionalPayload,
      });

      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          userType: user.user_type,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const supabase = this.supabaseService.getClient();

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', userId);

    if (updateError) {
      throw new BadRequestException('Error al actualizar la contraseña');
    }

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  private generateInvitationCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
