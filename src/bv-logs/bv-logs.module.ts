import { Module } from '@nestjs/common';
import { BvLogsService } from './bv-logs.service';
import { BvLogsController } from './bv-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BvLog } from './entities/bv-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BvLog])],
  controllers: [BvLogsController],
  providers: [BvLogsService],
  exports: [BvLogsService],
})
export class BvLogsModule {}
