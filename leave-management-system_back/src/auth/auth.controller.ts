import { Controller, Post, Body, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './types/register-user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Hardcoded users from database for testing (since DB connection is failing)
  private readonly testUsers = [
    { email: 'admin@company.com', password: 'password123', id: '1', firstName: 'Admin', lastName: 'User', roles: ['admin', 'hr'] },
    { email: 'sarah.johnson@company.com', password: 'password123', id: '2', firstName: 'Sarah', lastName: 'Johnson', roles: ['hr', 'manager'] },
    { email: 'david.wilson@company.com', password: 'password123', id: '3', firstName: 'David', lastName: 'Wilson', roles: ['manager'] },
    { email: 'emily.davis@company.com', password: 'password123', id: '4', firstName: 'Emily', lastName: 'Davis', roles: ['employee'] },
    { email: 'michael.brown@company.com', password: 'password123', id: '5', firstName: 'Michael', lastName: 'Brown', roles: ['employee'] },
  ];

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `profile-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        return callback(new Error('Only image files are allowed'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async register(
    @Body() registerDto: RegisterUserDto,
    @UploadedFile() profilePicture?: Express.Multer.File
  ) {
    console.log('🔍 Registration attempt received:', registerDto.email);
    console.log('📁 Profile picture:', profilePicture ? profilePicture.filename : 'No file uploaded');
    
    try {
      // Add profile picture path to registration data
      const registrationData = {
        ...registerDto,
        profilePictureUrl: profilePicture ? `/uploads/profiles/${profilePicture.filename}` : undefined
      };

      const result = await this.authService.registerUser(registrationData);
      console.log('✅ Registration successful for:', registerDto.email);
      return {
        success: true,
        user: result.data.user,
        data: result.data,
        message: 'Registration successful'
      };
    } catch (error) {
      console.log('❌ Registration failed for:', registerDto.email, error.message);
      throw error;
    }
  }
}