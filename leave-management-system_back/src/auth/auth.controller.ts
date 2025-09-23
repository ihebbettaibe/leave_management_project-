import { Controller, Post, Body, UnauthorizedException, UseInterceptors, UploadedFile, Get, UseGuards, Request, Query, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './types/register-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // DEV helper: issue a token for a user by ID (only in non-production environments)
  @Get('dev-token')
  async devToken(@Query('userId') userId: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Not available in production');
    }
    if (!userId) {
      return { success: false, message: 'userId query parameter is required' };
    }

    try {
      const user = await this.authService.findUserById(userId);
      const result = await this.authService.login(user);
      // Mirror login response structure
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  // Accept either { email, password } (frontend) or { identifier, password }
  async login(@Body() loginDto: { email?: string; identifier?: string; password: string }) {
    const identifier = loginDto.identifier || loginDto.email;
    console.log('🔍 Login attempt received for identifier/email:', identifier);
    if (!identifier || !loginDto.password) {
      console.log('❌ Login failed - missing identifier or password');
      throw new UnauthorizedException('Missing credentials');
    }

    try {
      const result = await this.authService.validateUserIdentifier(identifier, loginDto.password);
      console.log('✅ Login successful for:', identifier);
      // Return existing structure but also include top-level access_token and user for older frontends
      return {
        ...result,
        access_token: result.data?.access_token,
        user: result.data?.user,
      };
    } catch (error) {
      console.log('❌ Login failed for:', identifier, error.message);
      throw new UnauthorizedException('Invalid username/email or password');
    }
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Request() req) {
    const userId = req.user.userId || req.user.id;
    console.log('🔍 Getting current user for ID:', userId);
    console.log('🔍 Full req.user object:', req.user);
    
    try {
      // First, just return the JWT payload data to debug
      if (!userId) {
        console.log('❌ No userId found in request');
        return {
          success: false,
          error: 'No user ID found in token',
          user: req.user,
          message: 'Invalid token payload'
        };
      }
      
      const user = await this.authService.findUserById(userId);
      console.log('✅ Current user retrieved:', user.email);
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullname: user.fullname,
          phoneNumber: user.phoneNumber,
          teamId: user.teamId,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          bio: user.bio,
          profilePictureUrl: user.profilePictureUrl,
          isActive: user.isActive,
          roles: user.roles,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        message: 'User profile retrieved successfully'
      };
    } catch (error) {
      console.log('❌ Failed to get current user:', error.message);
      throw new UnauthorizedException('Unable to retrieve user profile');
    }
  }
}