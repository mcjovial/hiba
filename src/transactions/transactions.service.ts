import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomNotFoundException } from 'src/users/customNotFound.exception';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    // createTransactionDto.userId
    try {
      const newTransaction =
        this.transactionRepository.create(createTransactionDto);
      await this.transactionRepository.save(newTransaction);
      return newTransaction;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.transactionRepository.find({});
  }

  async findUserTransactions(userId: string) {
    return await this.transactionRepository
      .createQueryBuilder()
      .select('transaction')
      .from(Transaction, 'transaction')
      .where('transaction.user = :id', { id: userId })
      .getMany();
  }

  async findOne(id: string) {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      await this.transactionRepository.update(id, updateTransactionDto);
      const updatedTransaction = await this.transactionRepository.findOne({
        where: { id },
      });
      if (!updatedTransaction)
        throw new CustomNotFoundException('Transaction', id);
      return updatedTransaction;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    const deleteResponse = await this.transactionRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CustomNotFoundException('Transaction', id);
    }
  }
}
