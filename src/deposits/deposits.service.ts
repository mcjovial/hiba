import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateTrx } from 'src/common/helpers';
import { CustomNotFoundException } from 'src/users/customNotFound.exception';
import { Repository } from 'typeorm';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Deposit } from './entities/deposit.entity';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositsRepository: Repository<Deposit>,
  ) {}

  async create(createDepositDto: CreateDepositDto) {
    const trxn = generateTrx();
    console.log(trxn);
    const newDeposit = this.depositsRepository.create({
      ...createDepositDto,
      trxn,
    });
    await this.depositsRepository.save(newDeposit);
    return newDeposit;
  }

  async findAll() {
    return await this.depositsRepository.find({});
  }

  async findOne(id: string) {
    const deposit = await this.depositsRepository.findOne({ where: { id } });
    if (!deposit) throw new CustomNotFoundException('Deposit');
    return deposit;
  }

  async update(id: string, updateDepositDto: UpdateDepositDto) {
    console.log(updateDepositDto);
    await this.depositsRepository.update(id, updateDepositDto);
    const updatedDeposit = await this.depositsRepository.findOne({
      where: { id },
    });
    if (!updatedDeposit) throw new CustomNotFoundException('Deposit');
    return updatedDeposit;
  }

  async remove(id: string) {
    const deleteResponse = await this.depositsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CustomNotFoundException('Deposit');
    }
  }
}
