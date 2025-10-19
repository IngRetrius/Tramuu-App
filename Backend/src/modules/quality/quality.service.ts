import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';
import { CreateQualityTestDto } from './dto/create-quality-test.dto';
import { UpdateQualityTestDto } from './dto/update-quality-test.dto';

@Injectable()
export class QualityService {
  constructor(private supabaseService: SupabaseService) {}

  async create(companyId: string, dto: CreateQualityTestDto) {
    const supabase = this.supabaseService.getClient();

    // Check if test_id already exists
    const { data: existing } = await supabase
      .from('quality_tests')
      .select('id')
      .eq('company_id', companyId)
      .eq('test_id', dto.testId)
      .single();

    if (existing) {
      throw new BadRequestException('El ID de prueba ya existe');
    }

    const { data: test, error } = await supabase
      .from('quality_tests')
      .insert({
        company_id: companyId,
        milking_id: dto.milkingId,
        test_id: dto.testId,
        fat_percentage: dto.fatPercentage,
        protein_percentage: dto.proteinPercentage,
        ufc: dto.ufc,
        observations: dto.observations,
        test_date: dto.testDate,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Error al crear prueba de calidad');

    return test;
  }

  async findAll(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: tests, error } = await supabase
      .from('quality_tests')
      .select('*')
      .eq('company_id', companyId)
      .order('test_date', { ascending: false });

    if (error) throw new BadRequestException('Error al obtener pruebas');

    return tests || [];
  }

  async findOne(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: test, error } = await supabase
      .from('quality_tests')
      .select('*, milkings(id, shift, milking_date)')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !test) {
      throw new NotFoundException('Prueba de calidad no encontrada');
    }

    return test;
  }

  async update(id: string, companyId: string, dto: UpdateQualityTestDto) {
    const supabase = this.supabaseService.getClient();

    const { data: test, error } = await supabase
      .from('quality_tests')
      .update(dto)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Prueba de calidad no encontrada');
    }

    return test;
  }

  async remove(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('quality_tests')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new NotFoundException('Prueba de calidad no encontrada');

    return { message: 'Prueba eliminada exitosamente' };
  }

  async getStats(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: tests } = await supabase
      .from('quality_tests')
      .select('*')
      .eq('company_id', companyId);

    if (!tests || tests.length === 0) {
      return {
        total: 0,
        averages: {
          fat: 0,
          protein: 0,
          ufc: 0,
        },
      };
    }

    const avgFat =
      tests.reduce((sum, t) => sum + (parseFloat(t.fat_percentage) || 0), 0) / tests.length;
    const avgProtein =
      tests.reduce((sum, t) => sum + (parseFloat(t.protein_percentage) || 0), 0) / tests.length;
    const avgUfc = tests.reduce((sum, t) => sum + (parseInt(t.ufc) || 0), 0) / tests.length;

    return {
      total: tests.length,
      averages: {
        fat: parseFloat(avgFat.toFixed(2)),
        protein: parseFloat(avgProtein.toFixed(2)),
        ufc: Math.round(avgUfc),
      },
    };
  }
}
