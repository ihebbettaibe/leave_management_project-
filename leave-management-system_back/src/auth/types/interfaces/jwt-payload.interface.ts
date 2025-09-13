export interface JwtPayload {
  sub: number; // user id
  email: string;
  role: string;
  iat?: number; // issued at (added by JWT lib)
  exp?: number; // expiry (added by JWT lib)
}
