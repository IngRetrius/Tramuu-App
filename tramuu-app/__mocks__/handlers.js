/**
 * Mock Service Worker Handlers
 * Simula las respuestas del backend para testing
 */

import { rest } from 'msw';

const API_URL = 'http://localhost:3000/api';

// Datos de prueba
export const mockUser = {
  company: {
    id: 'company-uuid',
    email: 'company@test.com',
    userType: 'company',
    name: 'Test Company',
    phone: '1234567890',
    companyId: 'company-uuid',
    companyData: {
      id: 'company-uuid',
      name: 'Test Company',
      nit_id: '123456',
      phone: '1234567890',
    },
  },
  employee: {
    id: 'employee-uuid',
    email: 'employee@test.com',
    userType: 'employee',
    name: 'Test Employee',
    phone: '0987654321',
    employeeId: 'employee-uuid',
    companyId: 'company-uuid',
    employeeData: {
      id: 'employee-uuid',
      name: 'Test Employee',
      phone: '0987654321',
    },
  },
};

export const mockDashboardData = {
  today: {
    totalLiters: 500,
    milkingsAM: 12,
    milkingsPM: 10,
    avgPerCow: 25.5,
    activeCows: 20,
  },
  thisWeek: {
    totalLiters: 3500,
    dailyProduction: [
      { dayName: 'Lun', totalLiters: 500 },
      { dayName: 'Mar', totalLiters: 520 },
      { dayName: 'Mié', totalLiters: 480 },
      { dayName: 'Jue', totalLiters: 510 },
      { dayName: 'Vie', totalLiters: 490 },
      { dayName: 'Sáb', totalLiters: 500 },
      { dayName: 'Dom', totalLiters: 500 },
    ],
  },
  topProducers: [
    { id: '1', name: 'Vaca 001', breed: 'Holstein', daily_production: 35.5 },
    { id: '2', name: 'Vaca 002', breed: 'Jersey', daily_production: 32.0 },
    { id: '3', name: 'Vaca 003', breed: 'Holstein', daily_production: 30.5 },
  ],
};

export const handlers = [
  // Auth endpoints
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    const { email } = req.body;
    const isCompany = email.includes('company');
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: isCompany ? mockUser.company : mockUser.employee,
          company: isCompany ? mockUser.company.companyData : null,
          employee: !isCompany ? mockUser.employee.employeeData : null,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          companyId: 'company-uuid',
          employeeId: !isCompany ? 'employee-uuid' : null,
        },
        statusCode: 200,
      })
    );
  }),

  rest.post(`${API_URL}/auth/register/company`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: mockUser.company,
          company: mockUser.company.companyData,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          companyId: 'company-uuid',
        },
        statusCode: 200,
      })
    );
  }),

  rest.post(`${API_URL}/auth/register/employee`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: mockUser.employee,
          employee: mockUser.employee.employeeData,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          companyId: 'company-uuid',
          employeeId: 'employee-uuid',
        },
        statusCode: 200,
      })
    );
  }),

  rest.post(`${API_URL}/auth/refresh`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        accessToken: 'new-mock-access-token',
      })
    );
  }),

  // Dashboard endpoints
  rest.get(`${API_URL}/dashboard/summary`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockDashboardData,
        statusCode: 200,
      })
    );
  }),

  rest.get(`${API_URL}/dashboard/production`, (req, res, ctx) => {
    const period = req.url.searchParams.get('period') || 'week';
    
    const productionData = {
      day: {
        labels: ['6am', '9am', '12pm', '3pm', '6pm'],
        dataPoints: [
          { totalLiters: 50 },
          { totalLiters: 100 },
          { totalLiters: 80 },
          { totalLiters: 120 },
          { totalLiters: 150 },
        ],
      },
      week: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        dataPoints: mockDashboardData.thisWeek.dailyProduction,
      },
      month: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        dataPoints: [
          { totalLiters: 3500 },
          { totalLiters: 3600 },
          { totalLiters: 3400 },
          { totalLiters: 3550 },
        ],
      },
    };

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: productionData[period] || productionData.week,
        statusCode: 200,
      })
    );
  }),

  // Cows endpoints
  rest.get(`${API_URL}/cows`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: '1', name: 'Vaca 001', breed: 'Holstein', status: 'active' },
          { id: '2', name: 'Vaca 002', breed: 'Jersey', status: 'active' },
        ],
        statusCode: 200,
      })
    );
  }),

  rest.get(`${API_URL}/cows/stats`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          total: 20,
          active: 18,
          inactive: 2,
        },
        statusCode: 200,
      })
    );
  }),

  // Milkings endpoints
  rest.get(`${API_URL}/milkings`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: '1', cow_id: '1', liters: 25.5, shift: 'AM' },
          { id: '2', cow_id: '2', liters: 22.0, shift: 'PM' },
        ],
        statusCode: 200,
      })
    );
  }),

  rest.post(`${API_URL}/milkings/rapid`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: { id: 'new-milking', ...req.body },
        statusCode: 201,
      })
    );
  }),

  // Quality endpoints
  rest.get(`${API_URL}/quality/tests`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: '1', test_type: 'bacteria', result: 'pass' },
        ],
        statusCode: 200,
      })
    );
  }),

  // Inventory endpoints
  rest.get(`${API_URL}/inventory`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: '1', name: 'Alimento', quantity: 1000, unit: 'kg' },
        ],
        statusCode: 200,
      })
    );
  }),

  // Deliveries endpoints
  rest.get(`${API_URL}/deliveries`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: '1', client: 'Cliente A', liters: 500, status: 'pending' },
        ],
        statusCode: 200,
      })
    );
  }),

  // Companies endpoints
  rest.get(`${API_URL}/companies/me`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockUser.company.companyData,
        statusCode: 200,
      })
    );
  }),

  // Employees endpoints
  rest.get(`${API_URL}/employees/me`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockUser.employee.employeeData,
        statusCode: 200,
      })
    );
  }),

  // Error handlers para testing
  rest.get(`${API_URL}/error/401`, (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        message: 'Unauthorized',
        statusCode: 401,
      })
    );
  }),

  rest.get(`${API_URL}/error/500`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      })
    );
  }),
];

export default handlers;
