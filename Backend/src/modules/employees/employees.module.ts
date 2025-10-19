import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { SupabaseService } from '@database/supabase.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, SupabaseService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
