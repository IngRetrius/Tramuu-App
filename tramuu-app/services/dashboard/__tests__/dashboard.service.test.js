/**
 * Dashboard Service Tests
 * Pruebas para el servicio de dashboard
 */

import { setupMockServer } from '../../../__mocks__/server';
import dashboardService from '../../../services/dashboard/dashboard.service';

// Setup MSW
setupMockServer();

describe('DashboardService', () => {
  describe('getSummary', () => {
    it('should fetch dashboard summary successfully', async () => {
      const result = await dashboardService.getSummary();

      expect(result).toBeDefined();
      expect(result.today).toBeDefined();
      expect(result.today.totalLiters).toBe(500);
      expect(result.today.milkingsAM).toBe(12);
      expect(result.today.milkingsPM).toBe(10);
      expect(result.today.avgPerCow).toBe(25.5);
      expect(result.today.activeCows).toBe(20);
    });

    it('should include weekly production data', async () => {
      const result = await dashboardService.getSummary();

      expect(result.thisWeek).toBeDefined();
      expect(result.thisWeek.totalLiters).toBe(3500);
      expect(result.thisWeek.dailyProduction).toHaveLength(7);
    });

    it('should include top producers data', async () => {
      const result = await dashboardService.getSummary();

      expect(result.topProducers).toBeDefined();
      expect(result.topProducers).toHaveLength(3);
      expect(result.topProducers[0]).toHaveProperty('id');
      expect(result.topProducers[0]).toHaveProperty('name');
      expect(result.topProducers[0]).toHaveProperty('daily_production');
    });
  });

  describe('getProductionByPeriod', () => {
    it('should fetch daily production data', async () => {
      const result = await dashboardService.getProductionByPeriod('day');

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.labels).toBeDefined();
      expect(result.data.dataPoints).toBeDefined();
    });

    it('should fetch weekly production data', async () => {
      const result = await dashboardService.getProductionByPeriod('week');

      expect(result).toBeDefined();
      expect(result.data.labels).toHaveLength(7);
      expect(result.data.dataPoints).toHaveLength(7);
    });

    it('should fetch monthly production data', async () => {
      const result = await dashboardService.getProductionByPeriod('month');

      expect(result).toBeDefined();
      expect(result.data.labels).toHaveLength(4);
      expect(result.data.dataPoints).toHaveLength(4);
    });

    it('should default to week if no period specified', async () => {
      const result = await dashboardService.getProductionByPeriod();

      expect(result).toBeDefined();
      expect(result.data.labels).toHaveLength(7);
    });
  });

  describe('getEmployeeSummary', () => {
    it('should fetch employee dashboard summary', async () => {
      const result = await dashboardService.getEmployeeSummary();

      expect(result).toBeDefined();
      expect(result.today).toBeDefined();
      expect(result.today.totalLiters).toBe(500);
    });

    it('should return same data structure as getSummary', async () => {
      const companySummary = await dashboardService.getSummary();
      const employeeSummary = await dashboardService.getEmployeeSummary();

      expect(employeeSummary).toEqual(companySummary);
    });
  });
});
