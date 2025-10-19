import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryStatus } from './dto/create-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(companyId: string, employeeId: string, dto: CreateDeliveryDto) {
    const supabase = this.supabaseService.getClient();

    // Verify assigned employee if provided
    if (dto.assignedEmployeeId) {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('id', dto.assignedEmployeeId)
        .eq('company_id', companyId)
        .single();

      if (!employee) {
        throw new BadRequestException('Empleado asignado no encontrado');
      }
    }

    const { data: delivery, error } = await supabase
      .from('deliveries')
      .insert({
        company_id: companyId,
        client_name: dto.clientName,
        client_email: dto.clientEmail,
        client_phone: dto.clientPhone,
        delivery_address: dto.deliveryAddress,
        quantity: dto.quantity,
        scheduled_date: dto.scheduledDate,
        scheduled_time: dto.scheduledTime,
        assigned_employee_id: dto.assignedEmployeeId,
        status: DeliveryStatus.PENDING,
        notes: dto.notes,
        created_by: employeeId,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Error al crear entrega');

    return delivery;
  }

  async findAll(companyId: string, status?: DeliveryStatus, date?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('deliveries')
      .select('*, assigned_employee:employees!assigned_employee_id(id, name)')
      .eq('company_id', companyId)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('scheduled_date', date);
    }

    const { data: deliveries, error } = await query;

    if (error) throw new BadRequestException('Error al obtener entregas');

    return deliveries || [];
  }

  async findOne(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: delivery, error } = await supabase
      .from('deliveries')
      .select('*, assigned_employee:employees!assigned_employee_id(id, name), created_by_employee:employees!created_by(name)')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !delivery) {
      throw new NotFoundException('Entrega no encontrada');
    }

    return delivery;
  }

  async update(id: string, companyId: string, dto: UpdateDeliveryDto) {
    const supabase = this.supabaseService.getClient();

    // Verify assigned employee if being updated
    if (dto.assignedEmployeeId) {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('id', dto.assignedEmployeeId)
        .eq('company_id', companyId)
        .single();

      if (!employee) {
        throw new BadRequestException('Empleado asignado no encontrado');
      }
    }

    const updateData: any = { ...dto };

    // Convert camelCase to snake_case for database
    if (dto.clientName) updateData.client_name = dto.clientName;
    if (dto.clientEmail !== undefined) updateData.client_email = dto.clientEmail;
    if (dto.clientPhone !== undefined) updateData.client_phone = dto.clientPhone;
    if (dto.deliveryAddress) updateData.delivery_address = dto.deliveryAddress;
    if (dto.scheduledDate) updateData.scheduled_date = dto.scheduledDate;
    if (dto.scheduledTime !== undefined) updateData.scheduled_time = dto.scheduledTime;
    if (dto.assignedEmployeeId !== undefined) updateData.assigned_employee_id = dto.assignedEmployeeId;

    // Remove camelCase properties
    delete updateData.clientName;
    delete updateData.clientEmail;
    delete updateData.clientPhone;
    delete updateData.deliveryAddress;
    delete updateData.scheduledDate;
    delete updateData.scheduledTime;
    delete updateData.assignedEmployeeId;

    const { data: delivery, error } = await supabase
      .from('deliveries')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Entrega no encontrada');
    }

    return delivery;
  }

  async remove(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('deliveries')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new NotFoundException('Entrega no encontrada');

    return { message: 'Entrega eliminada exitosamente' };
  }

  async updateStatus(id: string, companyId: string, status: DeliveryStatus) {
    const supabase = this.supabaseService.getClient();

    const updateData: any = { status };

    // Add completion date if status is COMPLETED
    if (status === DeliveryStatus.COMPLETED) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data: delivery, error } = await supabase
      .from('deliveries')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Entrega no encontrada');
    }

    return delivery;
  }

  async getStats(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: deliveries } = await supabase
      .from('deliveries')
      .select('*')
      .eq('company_id', companyId);

    if (!deliveries || deliveries.length === 0) {
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        totalLitersDelivered: 0,
      };
    }

    const stats = deliveries.reduce(
      (acc, delivery) => {
        acc.total++;
        acc[delivery.status.toLowerCase()]++;

        if (delivery.status === DeliveryStatus.COMPLETED) {
          acc.totalLitersDelivered += parseFloat(delivery.quantity) || 0;
        }

        return acc;
      },
      {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        totalLitersDelivered: 0,
      },
    );

    return {
      ...stats,
      totalLitersDelivered: Math.round(stats.totalLitersDelivered),
    };
  }
}
