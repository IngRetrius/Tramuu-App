import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';

@Injectable()
export class CowsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(companyId: string, filters?: { breed?: string; status?: string; active?: boolean; search?: string }) {
    const supabase = this.supabaseService.getClient();

    let query = supabase.from('cows').select('*').eq('company_id', companyId);

    // Search filter - searches in cow_id and name
    if (filters?.search) {
      query = query.or(`cow_id.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
    }

    // Breed filter
    if (filters?.breed) {
      query = query.eq('breed', filters.breed);
    }

    // Status filter
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    // Active filter - default to only active cows
    if (filters?.active !== undefined) {
      query = query.eq('is_active', filters.active);
    } else {
      query = query.eq('is_active', true);
    }

    query = query.order('created_at', { ascending: false });

    const { data: cows, error } = await query;

    if (error) throw new BadRequestException('Error al obtener vacas');

    return cows || [];
  }

  async findOne(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: cow, error } = await supabase
      .from('cows')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !cow) {
      throw new NotFoundException('Vaca no encontrada');
    }

    return cow;
  }

  async create(companyId: string, dto: CreateCowDto) {
    const supabase = this.supabaseService.getClient();

    // Check if cow_id already exists for this company
    const { data: existing } = await supabase
      .from('cows')
      .select('id')
      .eq('company_id', companyId)
      .eq('cow_id', dto.cowId)
      .single();

    if (existing) {
      throw new BadRequestException('El ID de vaca ya existe en esta empresa');
    }

    const { data: cow, error } = await supabase
      .from('cows')
      .insert({
        company_id: companyId,
        cow_id: dto.cowId,
        name: dto.name,
        breed: dto.breed,
        status: dto.status,
        date_of_birth: dto.dateOfBirth,
        notes: dto.notes,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Error al crear vaca');

    return cow;
  }

  async update(id: string, companyId: string, dto: UpdateCowDto) {
    const supabase = this.supabaseService.getClient();

    const { data: cow, error } = await supabase
      .from('cows')
      .update(dto)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Vaca no encontrada');
    }

    return cow;
  }

  async remove(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    // Soft delete
    const { data: cow, error } = await supabase
      .from('cows')
      .update({ is_active: false })
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Vaca no encontrada');
    }

    return { message: 'Vaca desactivada exitosamente' };
  }

  async search(companyId: string, query: string) {
    const supabase = this.supabaseService.getClient();

    const { data: cows, error } = await supabase
      .from('cows')
      .select('*')
      .eq('company_id', companyId)
      .or(`cow_id.ilike.%${query}%,name.ilike.%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException('Error al buscar vacas');

    return cows || [];
  }

  async getStats(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: cows } = await supabase
      .from('cows')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true);

    const total = cows?.length || 0;
    const byBreed = cows?.reduce((acc, cow) => {
      acc[cow.breed] = (acc[cow.breed] || 0) + 1;
      return acc;
    }, {});
    const byStatus = cows?.reduce((acc, cow) => {
      acc[cow.status] = (acc[cow.status] || 0) + 1;
      return acc;
    }, {});

    const avgProduction =
      cows?.reduce((sum, cow) => sum + (parseFloat(cow.daily_production) || 0), 0) / total || 0;

    return {
      total,
      byBreed,
      byStatus,
      avgProduction: parseFloat(avgProduction.toFixed(2)),
    };
  }
}
