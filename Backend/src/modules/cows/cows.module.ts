import { Module } from '@nestjs/common';
import { CowsController } from './cows.controller';
import { CowsService } from './cows.service';
import { SupabaseService } from '@database/supabase.service';

@Module({
  controllers: [CowsController],
  providers: [CowsService, SupabaseService],
  exports: [CowsService],
})
export class CowsModule {}
