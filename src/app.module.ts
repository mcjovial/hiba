import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plans/plans.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BvLogsModule } from './bv-logs/bv-logs.module';
import { MlmModule } from './mlm/mlm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PlansModule,
    TransactionsModule,
    BvLogsModule,
    MlmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
