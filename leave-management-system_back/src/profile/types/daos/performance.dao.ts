export class PerformanceDao {
  id: number;
  userId: number;
  attendanceRate: number;
  performanceScore: number;
  activeProjects: number;
  reviewDate: Date;
  reviewerId: number;
  comments?: string;
  createdAt: Date;

  constructor(partial: Partial<PerformanceDao>) {
    Object.assign(this, partial);
  }

  get performanceGrade(): string {
    if (this.performanceScore >= 4.5) return 'Excellent';
    if (this.performanceScore >= 4.0) return 'Very Good';
    if (this.performanceScore >= 3.5) return 'Good';
    if (this.performanceScore >= 3.0) return 'Satisfactory';
    return 'Needs Improvement';
  }

  get attendanceGrade(): string {
    if (this.attendanceRate >= 95) return 'Excellent';
    if (this.attendanceRate >= 90) return 'Good';
    if (this.attendanceRate >= 85) return 'Satisfactory';
    return 'Poor';
  }

  toOverview() {
    return {
      attendanceRate: this.attendanceRate,
      attendanceGrade: this.attendanceGrade,
      performanceScore: this.performanceScore,
      performanceGrade: this.performanceGrade,
      activeProjects: this.activeProjects,
    };
  }
}
