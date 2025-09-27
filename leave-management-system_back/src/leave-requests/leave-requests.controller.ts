import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestStatus } from './entities/leave-request.entity';

@ApiTags('leave-requests')
@Controller('leave-requests')

export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user\'s leave requests' })
  @ApiResponse({ status: 200, description: 'Leave requests retrieved successfully' })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  async getMyLeaveRequests(
    @Request() req,
    @Query('month') month?: number,
    @Query('year') year?: number
  ) {
    const mockLeaveRequests = await this.leaveRequestsService.getMockLeaveRequests();
    
    return {
      success: true,
      data: mockLeaveRequests,
      message: 'Leave requests retrieved successfully'
    };
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all leave requests (HR/Admin only)' })
  @ApiResponse({ status: 200, description: 'All leave requests retrieved successfully' })
  async getAllLeaveRequests(@Request() req) {
    const leaveRequests = await this.leaveRequestsService.getAllLeaveRequests();
    
    return {
      success: true,
      data: leaveRequests,
      message: 'All leave requests retrieved successfully'
    };
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending leave requests (HR/Admin only)' })
  @ApiResponse({ status: 200, description: 'Pending leave requests retrieved successfully' })
  async getPendingLeaveRequests(@Request() req) {
    const pendingRequests = await this.leaveRequestsService.getMockLeaveRequests()
      .then(requests => requests.filter(req => req.status === 'pending'));
    
    return {
      success: true,
      data: pendingRequests,
      message: 'Pending leave requests retrieved successfully'
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new leave request' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully' })
  async createLeaveRequest(@Body() createLeaveRequestDto: any, @Request() req) {
    try {
      // For now, return a mock response since we don't have full database setup
      const mockRequest = {
        id: 'new-' + Date.now(),
        ...createLeaveRequestDto,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0],
        employee: {
          name: req.user.firstName + ' ' + req.user.lastName,
          email: req.user.email,
          department: req.user.department || 'Unknown'
        }
      };

      return {
        success: true,
        data: mockRequest,
        message: 'Leave request created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create leave request',
        error: error.message
      };
    }
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update leave request status (HR/Admin only)' })
  @ApiResponse({ status: 200, description: 'Leave request status updated successfully' })
  async updateLeaveRequestStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: LeaveRequestStatus },
    @Request() req
  ) {
    try {
      // For now, return a mock response
      const mockRequest = {
        id,
        status: updateStatusDto.status,
        reviewedBy: req.user.firstName + ' ' + req.user.lastName,
        reviewedAt: new Date().toISOString(),
        employee: {
          name: 'John Doe',
          email: 'john.doe@company.com',
          department: 'Engineering'
        }
      };

      return {
        success: true,
        data: mockRequest,
        message: `Leave request ${updateStatusDto.status} successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update leave request status',
        error: error.message
      };
    }
  }
}