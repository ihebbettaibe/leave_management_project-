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

  async findByUserId(userId: string) {
    const balances = await this.repo.find({ 
      where: { user: { id: userId } },
      relations: ['leaveType', 'user']
    });
    
    // If no balances found, return default balances
    if (!balances || balances.length === 0) {
      return {
        annual: { total: 25, used: 0, remaining: 25 },
        sick: { total: 12, used: 0, remaining: 12 },
        personal: { total: 15, used: 0, remaining: 15 }
      };
    }
    
    // Transform to expected format
    const result = {};
    balances.forEach(balance => {
      const leaveTypeName = balance.leaveType.name.toLowerCase();
      const total = balance.leaveType.maxDays || 0;
      const used = balance.used || 0;
      const carryover = balance.carryover || 0;
      const remaining = Math.max(0, total + carryover - used);
      
      result[leaveTypeName] = { total: total + carryover, used, remaining };
    });
    
    return result;
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
