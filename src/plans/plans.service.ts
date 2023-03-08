import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomNotFoundException } from 'src/users/customNotFound.exception';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    try {
      const newPlan = this.plansRepository.create(createPlanDto);
      await this.plansRepository.save(newPlan);
      return newPlan;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.plansRepository.find({});
  }

  async findOne(id: string) {
    const plan = await this.plansRepository.findOne({ where: { id } });
    if (!plan) throw new CustomNotFoundException('Plan');
    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    try {
      await this.plansRepository.update(id, updatePlanDto);
      const updatedPlan = await this.plansRepository.findOne({ where: { id } });
      if (!updatedPlan) throw new CustomNotFoundException('Plan', id);
      return updatedPlan;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    const deleteResponse = await this.plansRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CustomNotFoundException('Plan', id);
    }
  }
}
