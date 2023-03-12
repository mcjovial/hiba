import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateTrx } from 'src/common/helpers';
import { Paystack } from 'src/common/utils/paystack';
import { CustomNotFoundException } from 'src/users/customNotFound.exception';
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
      trxn: generateTrx(),
    });
    await this.depositsRepository.save(newDeposit);
    // topup user's account
    this.userService.creditUser(createDepositDto.user, createDepositDto.amount);
    return newDeposit;
  }

  async subscribe(subscribeDto: SubscribeDto) {
    const { amount, plan } = subscribeDto;
    const purpose = 'plan-subscription';
    const email = 'emmanuelelias@gmail.com';
    const user = 'hq9f9w7v37dnd8edhdb8e';
    const transaction = await this.paystack.initializedTransaction({
      amount: amount * 100,
      email,
      metadata: { purpose, plan, user },
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
      amount,
      reference,
      customer: { email },
      metadata: { purpose, plan, user },
    } = transaction.data;

    // save deposit and create transaction
    this.create({ plan, user, purpose, amount });
    // debit plan amount and create transaction
    this.userService.debitUser(user, amount, 'plan_subscription');
    // attach plan and perks to user
    this.userService.subscribeUserToPlan(plan, user);
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
