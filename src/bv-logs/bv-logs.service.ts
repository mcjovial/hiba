import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomNotFoundException } from 'src/users/customNotFound.exception';
import { Repository } from 'typeorm';
import { CreateBvLogDto } from './dto/create-bv-log.dto';
import { UpdateBvLogDto } from './dto/update-bv-log.dto';
import { BvLog } from './entities/bv-log.entity';

@Injectable()
export class BvLogsService {
  constructor(
    @InjectRepository(BvLog)
    private bvLogRepository: Repository<BvLog>,
  ) {}

  async create(createBvLogDto: CreateBvLogDto) {
    try {
      const newLog = this.bvLogRepository.create(createBvLogDto);
      await this.bvLogRepository.save(newLog);
      return newLog;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.bvLogRepository.find({});
  }

  async findUserBvLogs(userId: string) {
    return await this.bvLogRepository
      .createQueryBuilder()
      .select('bv-log')
      .from(BvLog, 'bv-log')
      .where('bv-log.user = :id', { id: userId })
      .getMany();
  }

  async findOne(id: string) {
    return await this.bvLogRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBvLogDto: UpdateBvLogDto) {
    try {
      await this.bvLogRepository.update(id, updateBvLogDto);
      const updatedBvLog = await this.bvLogRepository.findOne({
        where: { id },
      });
      if (!updatedBvLog) {
        throw new CustomNotFoundException('BV-Log');
      }
      return updatedBvLog;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    const deleteResponse = await this.bvLogRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CustomNotFoundException('BV-Log');
    }
  }
}
