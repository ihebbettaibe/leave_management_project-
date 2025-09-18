import { Module } from '@nestjs/common';
import { LeaveRequestsController } from './leave-requests.controller';

@Module({
  controllers: [LeaveRequestsController],
})
export class LeaveRequestsModule {}