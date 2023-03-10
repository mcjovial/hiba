import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { BvLogsModule } from 'src/bv-logs/bv-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Plan]),
    TransactionsModule,
    BvLogsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
