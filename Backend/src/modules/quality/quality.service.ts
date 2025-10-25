import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';
import { CreateQualityTestDto } from './dto/create-quality-test.dto';
import { UpdateQualityTestDto } from './dto/update-quality-test.dto';

@Injectable()
export class QualityService {
  constructor(private supabaseService: SupabaseService) {}

  async create(companyId: string, dto: CreateQualityTestDto) {
    const supabase = this.supabaseService.getClient();

    // Generate unique test ID
    const testDate = dto.date ? new Date(dto.date) : new Date();
    const testId = `TEST-${testDate.getFullYear()}${String(testDate.getMonth() + 1).padStart(2, '0')}${String(testDate.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;

    const { data: test, error } = await supabase
      .from('quality_tests')
      .insert({
        company_id: companyId,
        milking_id: dto.milkingId,
        test_id: testId,
        fat_percentage: dto.fat,
        protein_percentage: dto.protein,
        lactose_percentage: dto.lactose,
        ufc: dto.ufc,
        acidity: dto.acidity,
        observations: dto.notes,
        photo_url: dto.photo,
        test_date: dto.date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quality test:', error);
      throw new BadRequestException('Error al crear prueba de calidad: ' + error.message);
    }

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

    // Map database fields to frontend expected format
    const mappedTests = (tests || []).map(test => ({
      id: test.id || test.test_id,
      testId: test.test_id,
      fat: test.fat_percentage,
      protein: test.protein_percentage,
      lactose: test.lactose_percentage,
      ufc: test.ufc,
      acidity: test.acidity,
      notes: test.observations,
      photo: test.photo_url,
      date: test.test_date,
      createdAt: test.created_at,
    }));

    return { tests: mappedTests };
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
        averageFat: 0,
        averageProtein: 0,
        averageLactose: 0,
        averageUfc: 0,
        averageAcidity: 0,
      };
    }

    const avgFat =
      tests.reduce((sum, t) => sum + (parseFloat(t.fat_percentage) || 0), 0) / tests.length;
    const avgProtein =
      tests.reduce((sum, t) => sum + (parseFloat(t.protein_percentage) || 0), 0) / tests.length;
    const avgLactose =
      tests.reduce((sum, t) => sum + (parseFloat(t.lactose_percentage) || 0), 0) / tests.length;
    const avgUfc = tests.reduce((sum, t) => sum + (parseInt(t.ufc) || 0), 0) / tests.length;
    const avgAcidity =
      tests.reduce((sum, t) => sum + (parseFloat(t.acidity) || 0), 0) / tests.length;

    return {
      total: tests.length,
      averageFat: parseFloat(avgFat.toFixed(2)),
      averageProtein: parseFloat(avgProtein.toFixed(2)),
      averageLactose: parseFloat(avgLactose.toFixed(2)),
      averageUfc: Math.round(avgUfc),
      averageAcidity: parseFloat(avgAcidity.toFixed(2)),
    };
  }
}
