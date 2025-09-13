export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'CHANGE_THIS',
  expiresIn: '1h',
};
