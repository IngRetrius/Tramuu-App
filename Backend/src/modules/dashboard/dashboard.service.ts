import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private supabaseService: SupabaseService) {}

  async getSummary(companyId: string) {
    const supabase = this.supabaseService.getClient();
    const today = new Date().toISOString().split('T')[0];

    // Today's milkings
    const { data: todayMilkings } = await supabase
      .from('milkings')
      .select('*')
      .eq('company_id', companyId)
      .eq('milking_date', today);

    const totalLitersToday =
      todayMilkings?.reduce((sum, m) => sum + parseFloat(m.total_liters), 0) || 0;
    const milkingsAM = todayMilkings?.filter((m) => m.shift === 'AM').length || 0;
    const milkingsPM = todayMilkings?.filter((m) => m.shift === 'PM').length || 0;

    // Active cows
    const { data: cows } = await supabase
      .from('cows')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true);

    const activeCows = cows?.length || 0;
    const avgPerCow = activeCows > 0 ? totalLitersToday / activeCows : 0;

    // This week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startDate = startOfWeek.toISOString().split('T')[0];

    const { data: weekMilkings } = await supabase
      .from('milkings')
      .select('*')
      .eq('company_id', companyId)
      .gte('milking_date', startDate);

    const totalLitersWeek =
      weekMilkings?.reduce((sum, m) => sum + parseFloat(m.total_liters), 0) || 0;
    const daysInWeek = new Date().getDay() + 1;
    const avgDaily = daysInWeek > 0 ? totalLitersWeek / daysInWeek : 0;

    // Production by day of week (last 7 days)
    const dailyProduction = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayMilkings = weekMilkings?.filter(m => m.milking_date === dateStr) || [];
      const dayTotal = dayMilkings.reduce((sum, m) => sum + parseFloat(m.total_liters), 0);

      dailyProduction.push({
        date: dateStr,
        dayName: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()],
        totalLiters: parseFloat(dayTotal.toFixed(2)),
        milkingsCount: dayMilkings.length,
      });
    }

    // Top producers
    const { data: topProducers } = await supabase
      .from('cows')
      .select('id, cow_id, name, daily_production')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('daily_production', { ascending: false })
      .limit(5);

    // Recent milkings
    const { data: recentMilkings } = await supabase
      .from('milkings')
      .select('*, employees(name)')
      .eq('company_id', companyId)
      .order('milking_date', { ascending: false })
      .order('milking_time', { ascending: false })
      .limit(10);

    return {
      today: {
        totalLiters: parseFloat(totalLitersToday.toFixed(2)),
        milkingsAM,
        milkingsPM,
        activeCows,
        avgPerCow: parseFloat(avgPerCow.toFixed(2)),
      },
      thisWeek: {
        totalLiters: parseFloat(totalLitersWeek.toFixed(2)),
        avgDaily: parseFloat(avgDaily.toFixed(2)),
        trend: 'stable',
        dailyProduction, // Array with production for each day
      },
      topProducers: topProducers || [],
      recentMilkings: recentMilkings || [],
      alerts: [],
    };
  }

  async getMetrics(companyId: string) {
    const supabase = this.supabaseService.getClient();
    const today = new Date().toISOString().split('T')[0];

    // Daily production
    const { data: todayMilkings } = await supabase
      .from('milkings')
      .select('total_liters')
      .eq('company_id', companyId)
      .eq('milking_date', today);

    const daily =
      todayMilkings?.reduce((sum, m) => sum + parseFloat(m.total_liters), 0) || 0;

    // Weekly production
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekStart = startOfWeek.toISOString().split('T')[0];

    const { data: weekMilkings } = await supabase
      .from('milkings')
      .select('total_liters')
      .eq('company_id', companyId)
      .gte('milking_date', weekStart);

    const weekly =
      weekMilkings?.reduce((sum, m) => sum + parseFloat(m.total_liters), 0) || 0;

    // Monthly production
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStart = startOfMonth.toISOString().split('T')[0];

    const { data: monthMilkings } = await supabase
      .from('milkings')
      .select('total_liters')
      .eq('company_id', companyId)
      .gte('milking_date', monthStart);

    const monthly =
      monthMilkings?.reduce((sum, m) => sum + parseFloat(m.total_liters), 0) || 0;

    // Efficiency
    const { data: cows } = await supabase
      .from('cows')
      .select('daily_production')
      .eq('company_id', companyId)
      .eq('is_active', true);

    const activeCows = cows?.length || 0;
    const totalCowProduction =
      cows?.reduce((sum, c) => sum + parseFloat(c.daily_production || 0), 0) || 0;
    const avgPerCow = activeCows > 0 ? totalCowProduction / activeCows : 0;

    const { data: employees } = await supabase
      .from('employees')
      .select('id')
      .eq('company_id', companyId)
      .eq('is_active', true);

    const activeEmployees = employees?.length || 0;
    const avgPerEmployee = activeEmployees > 0 ? daily / activeEmployees : 0;

    // Quality
    const { data: qualityTests } = await supabase
      .from('quality_tests')
      .select('*')
      .eq('company_id', companyId)
      .gte('test_date', monthStart);

    const testsCount = qualityTests?.length || 0;
    const avgFat =
      testsCount > 0
        ? qualityTests.reduce((sum, t) => sum + (parseFloat(t.fat_percentage) || 0), 0) / testsCount
        : 0;
    const avgProtein =
      testsCount > 0
        ? qualityTests.reduce((sum, t) => sum + (parseFloat(t.protein_percentage) || 0), 0) /
          testsCount
        : 0;

    return {
      production: {
        daily: parseFloat(daily.toFixed(2)),
        weekly: parseFloat(weekly.toFixed(2)),
        monthly: parseFloat(monthly.toFixed(2)),
      },
      efficiency: {
        avgPerCow: parseFloat(avgPerCow.toFixed(2)),
        avgPerEmployee: parseFloat(avgPerEmployee.toFixed(2)),
      },
      quality: {
        avgFat: parseFloat(avgFat.toFixed(2)),
        avgProtein: parseFloat(avgProtein.toFixed(2)),
        testsCount,
      },
    };
  }

  async getProductionByPeriod(companyId: string, period: 'day' | 'week' | 'month') {
    const supabase = this.supabaseService.getClient();
    const currentDate = new Date();
    let startDate: Date;
    let labels: string[] = [];
    let dataPoints: { date: string; label: string; totalLiters: number; milkingsCount: number }[] = [];

    if (period === 'day') {
      // Last 24 hours - show by shift (AM/PM)
      const today = currentDate.toISOString().split('T')[0];

      const { data: todayMilkings } = await supabase
        .from('milkings')
        .select('*')
        .eq('company_id', companyId)
        .eq('milking_date', today);

      // Group by shift
      const amMilkings = todayMilkings?.filter(m => m.shift === 'AM') || [];
      const pmMilkings = todayMilkings?.filter(m => m.shift === 'PM') || [];

      const amTotal = amMilkings.reduce((sum, m) => sum + parseFloat(m.total_liters), 0);
      const pmTotal = pmMilkings.reduce((sum, m) => sum + parseFloat(m.total_liters), 0);

      labels = ['AM', 'PM'];
      dataPoints = [
        { date: today, label: 'AM', totalLiters: parseFloat(amTotal.toFixed(2)), milkingsCount: amMilkings.length },
        { date: today, label: 'PM', totalLiters: parseFloat(pmTotal.toFixed(2)), milkingsCount: pmMilkings.length },
      ];

    } else if (period === 'week') {
      // Last 7 days
      startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 6);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data: weekMilkings } = await supabase
        .from('milkings')
        .select('*')
        .eq('company_id', companyId)
        .gte('milking_date', startDateStr);

      // Group by day
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const dayMilkings = weekMilkings?.filter(m => m.milking_date === dateStr) || [];
        const dayTotal = dayMilkings.reduce((sum, m) => sum + parseFloat(m.total_liters), 0);

        const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
        labels.push(dayName);
        dataPoints.push({
          date: dateStr,
          label: dayName,
          totalLiters: parseFloat(dayTotal.toFixed(2)),
          milkingsCount: dayMilkings.length,
        });
      }

    } else if (period === 'month') {
      // Last 30 days grouped by week
      startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 29);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data: monthMilkings } = await supabase
        .from('milkings')
        .select('*')
        .eq('company_id', companyId)
        .gte('milking_date', startDateStr);

      // Group by week (4-5 weeks)
      const weeksCount = 4;
      const daysPerWeek = 7;

      for (let week = 0; week < weeksCount; week++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (week * daysPerWeek));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + daysPerWeek - 1);

        const weekStartStr = weekStart.toISOString().split('T')[0];
        const weekEndStr = weekEnd.toISOString().split('T')[0];

        const weekMilkingsData = monthMilkings?.filter(m =>
          m.milking_date >= weekStartStr && m.milking_date <= weekEndStr
        ) || [];

        const weekTotal = weekMilkingsData.reduce((sum, m) => sum + parseFloat(m.total_liters), 0);

        const weekLabel = `S${week + 1}`;
        labels.push(weekLabel);
        dataPoints.push({
          date: weekStartStr,
          label: weekLabel,
          totalLiters: parseFloat(weekTotal.toFixed(2)),
          milkingsCount: weekMilkingsData.length,
        });
      }
    }

    const totalLiters = dataPoints.reduce((sum, d) => sum + d.totalLiters, 0);
    const avgLiters = dataPoints.length > 0 ? totalLiters / dataPoints.length : 0;

    return {
      period,
      labels,
      dataPoints,
      summary: {
        totalLiters: parseFloat(totalLiters.toFixed(2)),
        avgLiters: parseFloat(avgLiters.toFixed(2)),
        dataPointsCount: dataPoints.length,
      },
    };
  }
}
