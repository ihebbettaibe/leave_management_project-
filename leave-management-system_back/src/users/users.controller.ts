import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './types/dtos/create-users.dto';
import { UpdateUsersDto } from './types/dtos/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getUser() {
    return this.usersService.getUser();
  }

  @Get(':id')
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUsersDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUsersDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    // Convert dateOfBirth from Date to string if present
    const dto: Partial<CreateUsersDto> = {
      ...updateUserDto,
      dateOfBirth: updateUserDto.dateOfBirth
        ? updateUserDto.dateOfBirth.toISOString()
        : undefined,
    };
    return this.usersService.updateUser(id, dto);
  }
  @Delete(':id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.deleteUser(id);
  }
}
