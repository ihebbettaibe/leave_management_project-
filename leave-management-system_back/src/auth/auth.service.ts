import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './types/interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // used by LocalStrategy
  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
  if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<AuthResponse> {
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.fullname.split(' ')[0] || user.fullname,
          lastName: user.fullname.split(' ').slice(1).join(' ') || '',
          roles: user.roles || [],
        },
      },
      message: 'Login successful'
    };
  }
}
