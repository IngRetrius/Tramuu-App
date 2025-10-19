import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { SupabaseService } from '@database/supabase.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, SupabaseService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
