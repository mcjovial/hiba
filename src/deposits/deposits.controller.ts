import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/common/guards/jwt-authentication.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { SubscribeDto } from './dto/subscription.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositsService.create(createDepositDto);
  }

  @Post('paystack')
  @UseGuards(JwtAuthenticationGuard)
  subscribe(
    @Body() subscribeDto: SubscribeDto,
    @Req() request: RequestWithUser,
  ) {
    return this.depositsService.subscribe(subscribeDto, request.user);
  }

  @Get('paystack')
  verifySubscription(@Query() query: any) {
    return this.depositsService.verifySubscription(query.trxref);
  }

  @Get()
  findAll() {
    return this.depositsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositsService.update(id, updateDepositDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositsService.remove(id);
  }
}
