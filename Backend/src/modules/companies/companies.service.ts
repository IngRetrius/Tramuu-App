import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private supabaseService: SupabaseService) {}

  async getMyCompany(userId: string, userType: string) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden acceder a esta información');
    }

    const supabase = this.supabaseService.getClient();

    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return company;
  }

  async updateMyCompany(userId: string, userType: string, dto: UpdateCompanyDto) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden actualizar esta información');
    }

    const supabase = this.supabaseService.getClient();

    const { data: company, error } = await supabase
      .from('companies')
      .update(dto)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Error al actualizar empresa');
    }

    return company;
  }

  async generateNewInvitationCode(userId: string, userType: string) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden generar códigos de invitación');
    }

    const supabase = this.supabaseService.getClient();

    // Generate new code
    const { data: codeData } = await supabase.rpc('generate_invitation_code');
    const newCode = codeData || this.generateInvitationCode();

    const { data: company, error } = await supabase
      .from('companies')
      .update({ invitation_code: newCode })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Error al generar código');
    }

    return {
      invitationCode: company.invitation_code,
    };
  }

  private generateInvitationCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
