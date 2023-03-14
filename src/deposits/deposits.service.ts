import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateTrx } from 'src/common/helpers';
import { Paystack } from 'src/common/utils/paystack';
import { CustomNotFoundException } from 'src/users/customNotFound.exception';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { SubscribeDto } from './dto/subscription.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Deposit } from './entities/deposit.entity';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositsRepository: Repository<Deposit>,
    private readonly userService: UsersService,
    private paystack: Paystack,
  ) {}

  async create(createDepositDto: CreateDepositDto) {
    const newDeposit = this.depositsRepository.create({
      ...createDepositDto,
    });
    await this.depositsRepository.save(newDeposit);
    // topup user's account
    this.userService.creditUser(createDepositDto.user, createDepositDto.amount);
    return newDeposit;
  }

  async subscribe(subscribeDto: SubscribeDto, user: User) {
    console.log(user);

    const { amount, plan } = subscribeDto;
    const purpose = 'plan-subscription';
    const transaction = await this.paystack.initializedTransaction({
      amount: amount * 100,
      email: user.email,
      metadata: { purpose, planId: plan, userId: user.id },
    });

    if (!transaction.status) {
      throw `${transaction.message}`;
    }

    return { authorization_url: transaction.data.authorization_url };
  }

  async verifySubscription(trxref: string) {
    const transaction = await this.paystack.verifyTransaction(trxref);

    if (!transaction.status) {
      throw `${transaction.message}`;
    }

    if (transaction.data.status !== 'success') {
      throw `${transaction.data.gateway_response}`;
    }

    const {
      reference,
      customer: { email },
      metadata: { purpose, planId, userId },
    } = transaction.data;
    const amount = transaction.data.amount / 100;

    // // save deposit and create transaction
    // this.create({
    //   plan: planId,
    //   user: userId,
    //   purpose,
    //   amount,
    //   trxn: reference,
    // });
    // // debit plan amount and create transaction
    // this.userService.debitUser(userId, amount, 'plan_subscription');
    // attach plan and perks to user
    this.userService.subscribeUserToPlan(planId, userId);
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
