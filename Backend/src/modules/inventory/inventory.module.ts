import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { SupabaseService } from '@database/supabase.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, SupabaseService],
  exports: [InventoryService],
})
export class InventoryModule {}
