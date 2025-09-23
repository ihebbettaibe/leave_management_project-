import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequest } from './entities/leave-request.entity';
import { User } from '../users/entities/users.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, User]),
    NotificationsModule,
  ],
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService],
  exports: [LeaveRequestsService],
})
export class LeaveRequestsModule {}