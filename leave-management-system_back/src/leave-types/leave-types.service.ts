import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTypeEntity } from './entities/leave-type.entity';
import { CreateLeaveTypeDto } from './types/dtos/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './types/dtos/update-leave-type.dto';
import { LeaveTypesPort } from './types/ports/leave-types.port';

@Injectable()
export class LeaveTypesService implements LeaveTypesPort {
  constructor(
    @InjectRepository(LeaveTypeEntity)
    private readonly repo: Repository<LeaveTypeEntity>,
  ) {}

  async create(dto: CreateLeaveTypeDto) {
    const lt = this.repo.create(dto);
    return await this.repo.save(lt);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const lt = await this.repo.findOne({ where: { id } });
    if (!lt) throw new NotFoundException(`LeaveType #${id} not found`);
    return lt;
  }

  async update(id: number, dto: UpdateLeaveTypeDto) {
    const lt = await this.findOne(id);
    Object.assign(lt, dto);
    return await this.repo.save(lt);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`LeaveType #${id} not found`);
  }
}
