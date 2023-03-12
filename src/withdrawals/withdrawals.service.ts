import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateTrx } from 'src/common/helpers';
import { CustomNotFoundException } from 'src/users/customNotFound.exception';
import { Repository } from 'typeorm';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { Status, Withdrawal } from './entities/withdrawal.entity';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalsRepository: Repository<Withdrawal>,
  ) {}

  async create(createWithdrawalDto: CreateWithdrawalDto) {
    const newWithdrawal = this.withdrawalsRepository.create({
      ...createWithdrawalDto,
      trxn: generateTrx(),
    });
    await this.withdrawalsRepository.save(newWithdrawal);
    return newWithdrawal;
  }

  async findAll() {
    return await this.withdrawalsRepository.find({});
  }

  async findForOne(id: string) {
    const withdrawal = await this.withdrawalsRepository
      .createQueryBuilder()
      .select('withdrawal')
      .from(Withdrawal, 'withdrawal')
      .where('withdrawal.user = :id', { id })
      .getMany();

    if (!withdrawal) throw new CustomNotFoundException('Withdrawal');
    return withdrawal;
  }

  async findPending() {
    const withdrawal = await this.withdrawalsRepository
      .createQueryBuilder()
      .select('withdrawal')
      .from(Withdrawal, 'withdrawal')
      .where('withdrawal.status = :status', { status: Status.PENDING })
      .getMany();

    console.log(withdrawal);
    if (!withdrawal) throw new CustomNotFoundException('Withdrawal');
    return withdrawal;
  }

  async findOne(id: string) {
    const withdrawal = await this.withdrawalsRepository.findOne({
      where: { id },
    });
    if (!withdrawal) throw new CustomNotFoundException('Withdrawal');
    return withdrawal;
  }

  async update(id: string, updateWithdrawalDto: UpdateWithdrawalDto) {
    await this.withdrawalsRepository.update(id, updateWithdrawalDto);
    const updatedWithdrawal = await this.withdrawalsRepository.findOne({
      where: { id },
    });
    if (!updatedWithdrawal) throw new CustomNotFoundException('Withdrawal');
    return updatedWithdrawal;
  }

  async approveOne(id: string, updateWithdrawalDto: UpdateWithdrawalDto) {
    console.log(updateWithdrawalDto);
    await this.withdrawalsRepository.update(id, updateWithdrawalDto);
    const updatedWithdrawal = await this.withdrawalsRepository.findOne({
      where: { id },
    });
    if (!updatedWithdrawal) throw new CustomNotFoundException('Withdrawal');
    return updatedWithdrawal;
  }

  async remove(id: string) {
    const deleteResponse = await this.withdrawalsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CustomNotFoundException('Withdrawal');
    }
  }
}
