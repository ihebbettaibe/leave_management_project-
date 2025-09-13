export interface IHoliday {
  id: number;
  name: string;
  date: Date;
  type: string; // HolidayType is not defined, use string or import the correct type
  isOptional: boolean;
  description?: string;
  createdAt: Date;
}
