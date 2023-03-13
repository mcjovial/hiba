import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { UsersModule } from 'src/users/users.module';
import { Paystack } from 'src/common/utils/paystack';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit]), UsersModule],
  controllers: [DepositsController],
  providers: [DepositsService, Paystack],
  exports: [DepositsService],
})
export class DepositsModule {}
