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
}
