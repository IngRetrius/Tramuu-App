import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { SupabaseService } from '@database/supabase.service';

@Module({
  controllers: [DeliveriesController],
  providers: [DeliveriesService, SupabaseService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
