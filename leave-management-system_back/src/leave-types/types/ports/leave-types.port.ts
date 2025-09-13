import { CreateLeaveTypeDto } from '../dtos/create-leave-type.dto';
import { UpdateLeaveTypeDto } from '../dtos/update-leave-type.dto';

export abstract class LeaveTypesPort {
  abstract create(dto: CreateLeaveTypeDto);
  abstract findAll();
  abstract findOne(id: number);
  abstract update(id: number, dto: UpdateLeaveTypeDto);
  abstract remove(id: number);
}
