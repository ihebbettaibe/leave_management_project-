export class UpdateUsersDto {
  fullname?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  roles?: string[];
  profilePictureUrl?: string;
  bio?: string;
  address?: string;
  dateOfBirth?: Date;
}
