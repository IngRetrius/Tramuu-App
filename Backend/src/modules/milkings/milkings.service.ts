import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';
import { CreateMilkingRapidDto } from './dto/create-milking-rapid.dto';
import { CreateMilkingIndividualDto } from './dto/create-milking-individual.dto';
import { CreateMilkingMassiveDto } from './dto/create-milking-massive.dto';

@Injectable()
export class MilkingsService {
  constructor(private supabaseService: SupabaseService) {}

  // Ordeño Rápido
  async createRapid(companyId: string, employeeId: string | undefined, dto: CreateMilkingRapidDto) {
    const supabase = this.supabaseService.getClient();

    const { data: milking, error } = await supabase
      .from('milkings')
      .insert({
        company_id: companyId,
        employee_id: employeeId || null,
        milking_type: 'rapid',
        shift: dto.shift,
        cow_count: dto.cowCount,
        total_liters: dto.totalLiters,
        notes: dto.notes,
        milking_date: dto.milkingDate,
        milking_time: dto.milkingTime,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Error al crear ordeño rápido');

    return milking;
  }

  // Ordeño Individual
  async createIndividual(
    companyId: string,
    employeeId: string | undefined,
    dto: CreateMilkingIndividualDto,
  ) {
    const supabase = this.supabaseService.getClient();

    const totalLiters = dto.cows.reduce((sum, cow) => sum + cow.liters, 0);

    // Create main milking record
    const { data: milking, error: milkingError } = await supabase
      .from('milkings')
      .insert({
        company_id: companyId,
        employee_id: employeeId || null,
        milking_type: 'individual',
        shift: dto.shift,
        cow_count: dto.cows.length,
        total_liters: totalLiters,
        notes: dto.notes,
        milking_date: dto.milkingDate,
        milking_time: dto.milkingTime,
      })
      .select()
      .single();

    if (milkingError) throw new BadRequestException('Error al crear ordeño individual');

    // Create individual milking records
    const individualRecords = dto.cows.map((cow) => ({
      milking_id: milking.id,
      cow_id: cow.cowId,
      liters: cow.liters,
    }));

    const { error: individualsError } = await supabase
      .from('individual_milkings')
      .insert(individualRecords);

    if (individualsError) {
      // Rollback milking
      await supabase.from('milkings').delete().eq('id', milking.id);
      throw new BadRequestException('Error al registrar ordeños individuales');
    }

    return milking;
  }

  // Ordeño Masivo
  async createMassive(
    companyId: string,
    employeeId: string | undefined,
    dto: CreateMilkingMassiveDto,
  ) {
    const supabase = this.supabaseService.getClient();

    // Create main milking record
    const { data: milking, error: milkingError } = await supabase
      .from('milkings')
      .insert({
        company_id: companyId,
        employee_id: employeeId || null,
        milking_type: 'massive',
        shift: dto.shift,
        cow_count: dto.cowIds.length,
        total_liters: dto.totalLiters,
        milking_date: dto.milkingDate,
        milking_time: dto.milkingTime,
      })
      .select()
      .single();

    if (milkingError) throw new BadRequestException('Error al crear ordeño masivo');

    // Calculate average liters per cow
    const avgLiters = dto.totalLiters / dto.cowIds.length;

    // Create individual milking records with average
    const individualRecords = dto.cowIds.map((cowId) => ({
      milking_id: milking.id,
      cow_id: cowId,
      liters: parseFloat(avgLiters.toFixed(2)),
    }));

    const { error: individualsError } = await supabase
      .from('individual_milkings')
      .insert(individualRecords);

    if (individualsError) {
      await supabase.from('milkings').delete().eq('id', milking.id);
      throw new BadRequestException('Error al registrar ordeños masivos');
    }

    return milking;
  }

  // Obtener todos los ordeños con filtros
  async findAll(companyId: string, filters?: { date?: string; shift?: string; employeeId?: string }) {
    const supabase = this.supabaseService.getClient();

    let query = supabase.from('milkings').select('*, employees(name)').eq('company_id', companyId);

    if (filters?.date) {
      query = query.eq('milking_date', filters.date);
    }
    if (filters?.shift) {
      query = query.eq('shift', filters.shift);
    }
    if (filters?.employeeId) {
      query = query.eq('employee_id', filters.employeeId);
    }

    query = query.order('milking_date', { ascending: false }).order('milking_time', { ascending: false });

    const { data: milkings, error } = await query;

    if (error) throw new BadRequestException('Error al obtener ordeños');

    return milkings || [];
  }

  // Obtener detalle de un ordeño
  async findOne(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: milking, error } = await supabase
      .from('milkings')
      .select('*, employees(id, name), individual_milkings(id, liters, cows(id, cow_id, name, breed))')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !milking) {
      throw new NotFoundException('Ordeño no encontrado');
    }

    return milking;
  }

  // Historial por vaca
  async getCowHistory(cowId: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: records, error } = await supabase
      .from('individual_milkings')
      .select('*, milkings!inner(id, shift, milking_date, milking_time, milking_type, employees(name))')
      .eq('cow_id', cowId)
      .eq('milkings.company_id', companyId)
      .order('milkings(milking_date)', { ascending: false });

    if (error) throw new BadRequestException('Error al obtener historial de vaca');

    return records || [];
  }

  // Historial por empleado
  async getEmployeeHistory(employeeId: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: milkings, error } = await supabase
      .from('milkings')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('company_id', companyId)
      .order('milking_date', { ascending: false })
      .order('milking_time', { ascending: false });

    if (error) throw new BadRequestException('Error al obtener historial de empleado');

    const totalLiters = milkings?.reduce((sum, m) => sum + parseFloat(m.total_liters), 0) || 0;
    const totalMilkings = milkings?.length || 0;

    return {
      milkings: milkings || [],
      summary: {
        totalMilkings,
        totalLiters: parseFloat(totalLiters.toFixed(2)),
        avgPerMilking: totalMilkings > 0 ? parseFloat((totalLiters / totalMilkings).toFixed(2)) : 0,
      },
    };
  }

  // Estadísticas diarias
  async getDailyStats(companyId: string, date: string) {
    const supabase = this.supabaseService.getClient();

    const { data: milkings } = await supabase
      .from('milkings')
      .select('*')
      .eq('company_id', companyId)
      .eq('milking_date', date);

    const amMilkings = milkings?.filter((m) => m.shift === 'AM') || [];
    const pmMilkings = milkings?.filter((m) => m.shift === 'PM') || [];

    const totalLitersAM = amMilkings.reduce((sum, m) => sum + parseFloat(m.total_liters), 0);
    const totalLitersPM = pmMilkings.reduce((sum, m) => sum + parseFloat(m.total_liters), 0);
    const totalLiters = totalLitersAM + totalLitersPM;

    return {
      date,
      totalLiters: parseFloat(totalLiters.toFixed(2)),
      shifts: {
        AM: {
          count: amMilkings.length,
          liters: parseFloat(totalLitersAM.toFixed(2)),
        },
        PM: {
          count: pmMilkings.length,
          liters: parseFloat(totalLitersPM.toFixed(2)),
        },
      },
    };
  }

  // Eliminar ordeño
  async remove(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.from('milkings').delete().eq('id', id).eq('company_id', companyId);

    if (error) throw new NotFoundException('Ordeño no encontrado');

    return { message: 'Ordeño eliminado exitosamente' };
  }
}
