import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LeaveBalancesService } from './leave-balances.service';
import { CreateBalanceDto } from './types/dtos/create-balance.dto';
import { AdjustBalanceDto } from './types/dtos/adjust-balance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('leave-balances')
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyBalances(@Req() req: Request) {
    const user = (req as any).user;
    return await this.svc.findByUserId(user.id || user.userId);
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
