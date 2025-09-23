import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [EmailNotificationService],
  controllers: [NotificationsController],
  exports: [EmailNotificationService],
})
export class NotificationsModule {}
