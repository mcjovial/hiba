import { Module } from '@nestjs/common';
import { MlmService } from './mlm.service';
import { MlmController } from './mlm.controller';
import { UsersModule } from 'src/users/users.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [UsersModule, TransactionsModule],
  controllers: [MlmController],
  providers: [MlmService],
})
export class MlmModule {}
