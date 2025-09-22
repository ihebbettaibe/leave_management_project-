import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProfilePictureService } from './profile-picture.service';
import { UsersRepository } from './repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, ProfilePictureService, UsersRepository],
  exports: [UsersService, ProfilePictureService, UsersRepository],
})
export class UsersModule {}
