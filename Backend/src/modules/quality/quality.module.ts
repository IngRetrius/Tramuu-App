import { Module } from '@nestjs/common';
import { QualityController } from './quality.controller';
import { QualityService } from './quality.service';
import { SupabaseService } from '@database/supabase.service';

@Module({
  controllers: [QualityController],
  providers: [QualityService, SupabaseService],
  exports: [QualityService],
})
export class QualityModule {}
