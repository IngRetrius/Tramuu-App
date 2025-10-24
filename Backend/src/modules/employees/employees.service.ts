import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '@database/supabase.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: employees, error } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException('Error al obtener empleados');

    return employees || [];
  }

  async findOne(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return employee;
  }

  async create(companyId: string, dto: CreateEmployeeDto) {
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

    if (userError) throw new BadRequestException('Error al crear usuario');

    // Create employee
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        user_id: user.id,
        company_id: companyId,
        name: dto.name,
        phone: dto.phone,
      })
      .select()
      .single();

    if (employeeError) {
      await supabase.from('users').delete().eq('id', user.id);
      throw new BadRequestException('Error al crear empleado');
    }

    return employee;
  }

  async update(id: string, companyId: string, dto: UpdateEmployeeDto) {
    const supabase = this.supabaseService.getClient();

    const { data: employee, error } = await supabase
      .from('employees')
      .update(dto)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return employee;
  }

  async remove(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    // Get employee to get user_id
    const { data: employee } = await supabase
      .from('employees')
      .select('user_id')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    // Delete user (will cascade to employee)
    const { error } = await supabase.from('users').delete().eq('id', employee.user_id);

    if (error) throw new BadRequestException('Error al eliminar empleado');

    return { message: 'Empleado eliminado exitosamente' };
  }

  async toggleStatus(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    // Get current status
    const { data: employee } = await supabase
      .from('employees')
      .select('is_active')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const { data: updated, error } = await supabase
      .from('employees')
      .update({ is_active: !employee.is_active })
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw new BadRequestException('Error al actualizar estado');

    return updated;
  }

  async getMyProfile(userId: string, userType: string, employeeId: string) {
    if (userType !== 'employee') {
      throw new ForbiddenException('Solo empleados pueden acceder a esta información');
    }

    const supabase = this.supabaseService.getClient();

    // Get employee with company info and user email
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*, companies(name, invitation_code), users(email)')
      .eq('id', employeeId)
      .single();

    if (error || !employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    // Flatten the response
    return {
      id: employee.id,
      user_id: employee.user_id,
      name: employee.name,
      documentId: employee.document_id,
      phone: employee.phone,
      email: employee.users?.email,
      isActive: employee.is_active,
      companyId: employee.company_id,
      companyName: employee.companies?.name,
      companyInvitationCode: employee.companies?.invitation_code,
      created_at: employee.created_at,
      updated_at: employee.updated_at,
    };
  }

  async updateMyProfile(userId: string, userType: string, employeeId: string, dto: UpdateEmployeeDto) {
    if (userType !== 'employee') {
      throw new ForbiddenException('Solo empleados pueden actualizar esta información');
    }

    const supabase = this.supabaseService.getClient();

    // Map 'documentId' to 'document_id' for database compatibility
    const updateData: any = { ...dto };
    if (dto.documentId) {
      updateData.document_id = dto.documentId;
      delete updateData.documentId;
    }

    const { data: employee, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', employeeId)
      .select('*, companies(name, invitation_code), users(email)')
      .single();

    if (error) {
      throw new NotFoundException('Error al actualizar perfil');
    }

    // Return flattened response
    return {
      id: employee.id,
      user_id: employee.user_id,
      name: employee.name,
      documentId: employee.document_id,
      phone: employee.phone,
      email: employee.users?.email,
      isActive: employee.is_active,
      companyId: employee.company_id,
      companyName: employee.companies?.name,
      companyInvitationCode: employee.companies?.invitation_code,
      created_at: employee.created_at,
      updated_at: employee.updated_at,
    };
  }
}
