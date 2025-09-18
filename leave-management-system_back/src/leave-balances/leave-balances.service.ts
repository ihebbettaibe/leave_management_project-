import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveBalanceEntity } from './entities/leave-balance.entity';
import { AdjustBalanceDto } from './types/dtos/adjust-balance.dto';
import { CreateBalanceDto } from './types/dtos/create-balance.dto';
import { User } from '../users/entities/users.entity';
import { LeaveTypeEntity } from '../leave-types/entities/leave-type.entity';
import { LeaveBalancesPort } from './types/ports/leave-balances.port';

@Injectable()
export class LeaveBalancesService implements LeaveBalancesPort {
  constructor(
    @InjectRepository(LeaveBalanceEntity)
    private readonly repo: Repository<LeaveBalanceEntity>,
  @InjectRepository(User)
  private readonly usersRepo: Repository<User>,
    @InjectRepository(LeaveTypeEntity)
    private readonly ltRepo: Repository<LeaveTypeEntity>,
  ) {}

  async create(dto: CreateBalanceDto) {
  const user = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User #${dto.userId} not found`);
    }

  const lt = await this.ltRepo.findOne({ where: { id: dto.leaveTypeId } });
    if (!lt) {
      throw new NotFoundException(`LeaveType #${dto.leaveTypeId} not found`);
    }

    const lb = this.repo.create({
      user,
      leaveType: lt,
      year: dto.year,
      carryover: dto.carryover,
      used: dto.used,
    });
    return await this.repo.save(lb);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
  const lb = await this.repo.findOne({ where: { id } });
    if (!lb) throw new NotFoundException(`LeaveBalance #${id} not found`);
    return lb;
  }

  async adjust(id: number, dto: AdjustBalanceDto) {
    const lb = await this.findOne(id);
    lb.year = dto.year;
    lb.carryover = dto.carryover;
    lb.used = dto.used;
    return await this.repo.save(lb);
  }
}
