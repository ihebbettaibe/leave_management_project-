import { Gender } from '../enums/gender.enum';
import { IContactInfo } from './contact-info.interface';

export interface IEmployeeProfile {
  id: number;
  userId: number;
  employeeId: string;
  department: string;
  designation: string;
  joinDate: Date;
  gender: Gender;
  dateOfBirth?: Date;
  contactInfo: IContactInfo;
  workExperience: number;
  idProofType?: string;
  idProofNumber?: string;
  profilePicture?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
