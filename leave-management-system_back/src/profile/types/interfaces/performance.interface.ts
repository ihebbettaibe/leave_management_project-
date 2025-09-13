export interface IPerformance {
  id: number;
  userId: number;
  attendanceRate: number;
  performanceScore: number;
  activeProjects: number;
  reviewDate: Date;
  reviewerId: number;
  comments?: string;
}
