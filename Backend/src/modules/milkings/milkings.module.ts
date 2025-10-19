import { Module } from '@nestjs/common';
import { MilkingsController } from './milkings.controller';
import { MilkingsService } from './milkings.service';
import { SupabaseService } from '@database/supabase.service';

@Module({
  controllers: [MilkingsController],
  providers: [MilkingsService, SupabaseService],
  exports: [MilkingsService],
})
export class MilkingsModule {}
