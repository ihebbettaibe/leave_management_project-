import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LeaveBalancesService } from './leave-balances.service';
import { CreateBalanceDto } from './types/dtos/create-balance.dto';
import { AdjustBalanceDto } from './types/dtos/adjust-balance.dto';

@Controller('leave-balances')
export class LeaveBalancesController {
  constructor(private readonly svc: LeaveBalancesService) {}

  @Post()
  async create(@Body() dto: CreateBalanceDto) {
    return await this.svc.create(dto);
  }

  @Get()
  async findAll() {
    return await this.svc.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.svc.findOne(id);
  }

  @Patch(':id')
  async adjust(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdjustBalanceDto,
  ) {
    return await this.svc.adjust(id, dto);
  }
}
