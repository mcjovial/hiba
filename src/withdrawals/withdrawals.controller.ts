import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { Status } from './entities/withdrawal.entity';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  create(@Body() createWithdrawalDto: CreateWithdrawalDto) {
    return this.withdrawalsService.create(createWithdrawalDto);
  }

  @Get()
  findAll() {
    return this.withdrawalsService.findAll();
  }

  @Get('pending')
  findPending() {
    return this.withdrawalsService.findPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawalsService.findOne(id);
  }

  @Get('user/:id')
  findForOne(@Param('id') id: string) {
    return this.withdrawalsService.findForOne(id);
  }

  @Post('approve/:id')
  approveOne(@Param('id') id: string) {
    return this.withdrawalsService.approveOne(id, { status: Status.APPROVED });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWithdrawalDto: UpdateWithdrawalDto,
  ) {
    return this.withdrawalsService.update(id, updateWithdrawalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawalsService.remove(id);
  }
}
