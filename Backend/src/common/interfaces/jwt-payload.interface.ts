export interface JwtPayload {
  sub: string; // user id
  email: string;
  userType: 'company' | 'employee';
  companyId?: string;
  employeeId?: string;
}
