import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Plan } from 'src/plans/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Plan])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
