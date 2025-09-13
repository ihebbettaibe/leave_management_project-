import { IIdentifiable } from 'src/shared/types/Interfaces/identifiable.interfaces';

export interface IUser extends IIdentifiable {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  isActive: boolean;
  lastLogin?: Date;
  roles: string[];
  profilePictureUrl?: string;
  bio?: string;
  address?: string;
}
