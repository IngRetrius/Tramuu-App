import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Common
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

// Database
import { SupabaseService } from '@database/supabase.service';

// Modules
import { AuthModule } from '@modules/auth/auth.module';
import { CompaniesModule } from '@modules/companies/companies.module';
import { EmployeesModule } from '@modules/employees/employees.module';
import { CowsModule } from '@modules/cows/cows.module';
import { MilkingsModule } from '@modules/milkings/milkings.module';
import { QualityModule } from '@modules/quality/quality.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { DeliveriesModule } from '@modules/deliveries/deliveries.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CompaniesModule,
    EmployeesModule,
    CowsModule,
    MilkingsModule,
    QualityModule,
    InventoryModule,
    DeliveriesModule,
    DashboardModule,
  ],
  providers: [
    SupabaseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
