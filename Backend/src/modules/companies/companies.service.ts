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

    // Get company with user email
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*, users(email)')
      .eq('user_id', userId)
      .single();

    if (companyError || !company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    // Flatten the response to include email at the root level
    return {
      id: company.id,
      user_id: company.user_id,
      name: company.name,
      nit: company.nit_id,
      nitId: company.nit_id,
      phone: company.phone,
      address: company.address,
      invitationCode: company.invitation_code,
      email: company.users?.email,
      created_at: company.created_at,
      updated_at: company.updated_at,
    };
  }

  async updateMyCompany(userId: string, userType: string, dto: UpdateCompanyDto) {
    if (userType !== 'company') {
      throw new ForbiddenException('Solo empresas pueden actualizar esta información');
    }

    const supabase = this.supabaseService.getClient();

    // Map 'nit' to 'nit_id' for database compatibility
    const updateData: any = { ...dto };
    if (dto.nit) {
      updateData.nit_id = dto.nit;
      delete updateData.nit;
    }

    const { data: company, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('user_id', userId)
      .select('*, users(email)')
      .single();

    if (error) {
      throw new NotFoundException('Error al actualizar empresa');
    }

    // Return flattened response with email
    return {
      id: company.id,
      user_id: company.user_id,
      name: company.name,
      nit: company.nit_id,
      nitId: company.nit_id,
      phone: company.phone,
      address: company.address,
      invitationCode: company.invitation_code,
      email: company.users?.email,
      created_at: company.created_at,
      updated_at: company.updated_at,
    };
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
