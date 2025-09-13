import { LeaveType } from './leave-type.model';

export const LEAVE_TYPES: LeaveType[] = [
  { value: 'annual', label: 'Annual Leave', maxDays: 24, color: '#10b981' },
  { value: 'sick', label: 'Sick Leave', maxDays: 10, color: '#8b5cf6' },
  { value: 'personal', label: 'Personal Leave', maxDays: 5, color: '#f59e0b' },
  {
    value: 'maternity',
    label: 'Maternity Leave',
    maxDays: 180,
    color: '#ec4899',
  },
  {
    value: 'paternity',
    label: 'Paternity Leave',
    maxDays: 15,
    color: '#3b82f6',
  },
  {
    value: 'emergency',
    label: 'Emergency Leave',
    maxDays: 3,
    color: '#ef4444',
  },

  { value: 'half-day', label: 'Half Day', maxDays: 1, color: '#f59e0b' },
];
