import { ActivityType } from '../enums/activity-type.enum';

export class ActivityDao {
  id: number;
  userId: number;
  type: ActivityType;
  title: string;
  description?: string;
  relatedEntityId?: number;
  createdAt: Date;

  constructor(partial: Partial<ActivityDao>) {
    Object.assign(this, partial);
  }

  get timeAgo(): string {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    return 'Today';
  }

  get displayDate(): string {
    return this.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  toSummary() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      description: this.description,
      timeAgo: this.timeAgo,
      displayDate: this.displayDate,
      createdAt: this.createdAt,
    };
  }
}
