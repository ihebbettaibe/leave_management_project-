import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('leave-requests')
@Controller('leave-requests')
export class LeaveRequestsController {
  @Get('me')
  @ApiOperation({ summary: 'Get current user\'s leave requests' })
  @ApiResponse({ status: 200, description: 'Leave requests retrieved successfully' })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  async getMyLeaveRequests(
    @Query('month') month?: number,
    @Query('year') year?: number
  ) {
    // Return mock leave requests for current user
    const mockLeaveRequests = [
      {
        id: '1',
        type: 'annual',
        startDate: '2025-09-15',
        endDate: '2025-09-17',
        days: 3,
        status: 'approved',
        reason: 'Family vacation',
        appliedDate: '2025-08-20'
      },
      {
        id: '2',
        type: 'sick',
        startDate: '2025-08-10',
        endDate: '2025-08-10',
        days: 1,
        status: 'approved',
        reason: 'Medical appointment',
        appliedDate: '2025-08-09'
      },
      {
        id: '3',
        type: 'personal',
        startDate: '2025-10-05',
        endDate: '2025-10-06',
        days: 2,
        status: 'pending',
        reason: 'Personal matters',
        appliedDate: '2025-09-20'
      }
    ];

    return {
      success: true,
      data: mockLeaveRequests,
      message: 'Leave requests retrieved successfully'
    };
  }
}