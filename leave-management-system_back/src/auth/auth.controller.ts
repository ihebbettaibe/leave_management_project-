import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // Hardcoded users from database for testing (since DB connection is failing)
  private readonly testUsers = [
    { email: 'admin@company.com', password: 'password123', id: '1', firstName: 'Admin', lastName: 'User', roles: ['admin', 'hr'] },
    { email: 'sarah.johnson@company.com', password: 'password123', id: '2', firstName: 'Sarah', lastName: 'Johnson', roles: ['hr', 'manager'] },
    { email: 'david.wilson@company.com', password: 'password123', id: '3', firstName: 'David', lastName: 'Wilson', roles: ['manager'] },
    { email: 'emily.davis@company.com', password: 'password123', id: '4', firstName: 'Emily', lastName: 'Davis', roles: ['employee'] },
    { email: 'michael.brown@company.com', password: 'password123', id: '5', firstName: 'Michael', lastName: 'Brown', roles: ['employee'] },
  ];

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    console.log('🔍 Login attempt received:', loginDto.email);
    
    const user = this.testUsers.find(u => u.email === loginDto.email && u.password === loginDto.password);
    
    if (!user) {
      console.log('❌ Login failed for:', loginDto.email);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Mock JWT token (in real implementation this would be signed)
    const mockToken = `mock.jwt.token.${user.id}.${Date.now()}`;

    console.log('✅ Login successful for:', user.email, 'Role:', user.roles.join(', '));

    return {
      success: true,
      data: {
        access_token: mockToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
        },
      },
      message: 'Login successful'
    };
  }
}
