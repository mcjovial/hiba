import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BvLogsService } from 'src/bv-logs/bv-logs.service';
import { generateTrx } from 'src/common/helpers';
import { PlansService } from 'src/plans/plans.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Repository } from 'typeorm';
import { CustomNotFoundException } from './customNotFound.exception';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly transactionService: TransactionsService,
    private readonly bvLogService: BvLogsService,
    private readonly planService: PlansService,
  ) {}

  async create(userData: CreateUserDto) {
    userData.role = 'customer';
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getAllUsers() {
    const [items, count] = await this.userRepository.findAndCount({});
    return {
      items,
      count,
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['referrer', 'sponsor'],
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    data.plan = await this.planService.findOne(data.planId);
    await this.userRepository.update(id, data);
    const updatedTask = await this.userRepository.find({
      where: { id },
      relations: ['plan'],
    });
    if (updatedTask) {
      return updatedTask;
    }
    throw new CustomNotFoundException('Task', id);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteUser(id: string) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CustomNotFoundException('Task', id);
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getHibaUsersCount() {
    return await this.userRepository.count({ where: { isHibaUser: true } });
  }

  async getPositionUser(id: string, position: any) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.sponsor = :id', { id })
      .andWhere('user.position = :position', { position })
      .getOne();

    if (!user) return false;
    return user;
  }

  async getUserTree(id: string) {
    const userCount = await this.getHibaUsersCount();
    const heap = [await this.findOne(id)];
    let tid = id;
    for (let i = 0; i < userCount; i++) {
      if (i != 0) tid = heap[i].id;
      heap.push((await this.getPositionUser(tid, 'left')) || undefined);
      heap.push((await this.getPositionUser(tid, 'right')) || undefined);
    }
    return heap;
  }

  async creditUser(id: string, amount: number) {
    const user = await this.findOne(id);
    // pre-transaction
    const pre_transaction = await this.transactionService.create({
      user: user,
      preBalance: user.balance,
    });

    await this.userRepository.increment({ id }, 'balance', amount);

    // post-transaction
    await this.transactionService.update(pre_transaction.id, {
      charge: 0,
      postBalance: (await this.findOne(id)).balance,
      amount,
      trx: generateTrx(),
      trxType: '+',
      details: 'paystack_deposit',
    });
    return true;
  }

  async debitUser(id: string, amount: number, purpose: string) {
    const user = await this.findOne(id);
    // pre-transaction
    const pre_transaction = await this.transactionService.create({
      user: user,
      preBalance: user.balance,
    });

    await this.userRepository.decrement({ id }, 'balance', amount);

    // post-transaction
    await this.transactionService.update(pre_transaction.id, {
      charge: 0,
      postBalance: (await this.findOne(id)).balance,
      amount,
      trx: generateTrx(),
      trxType: '+',
      details: purpose,
    });
    return true;
  }

  async subscribeUserToPlan(planId: string, userId: string) {
    const plan = await this.planService.findOne(planId);
    await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({
        plan: plan,
        balance: () => `balance + ${plan.bv}`,
        shopping_wallet: () => `shopping_wallet + ${plan.coupon}`,
      })
      .where('id = :id', { id: userId })
      .execute();

    this.updateBV(userId);
  }

  async massIncrement(num: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({
        total_referral_bonus: 9,
        balance: () => `${'balance'} - ${num}`,
        shopping_wallet: () => `${'shopping_wallet'} + ${num}`,
      })
      .where('id = :id', { id: '396b1e2d-7214-435f-8122-cfd9b8b60635' })
      .execute();
  }

  async matchingBonus(id: string) {
    const user = await this.findOne(id);
    const userTree = await this.getUserTree(id);
    if (
      userTree[1] &&
      userTree[2] &&
      userTree[3] &&
      userTree[4] &&
      userTree[5] &&
      userTree[6] &&
      user.matching_bonus == 0
    ) {
      let amount: number, position: string;
      if (userTree[2].total_bonus > userTree[1].total_bonus) {
        amount = userTree[1].total_bonus * 0.15;
        position = userTree[1].position;
      } else {
        amount = userTree[2].total_bonus * 0.15;
        position = userTree[2].position;
      }

      // pre-transaction
      const pre_transaction = await this.transactionService.create({
        user: user,
        preBalance: user.balance,
      });
      // award bonus
      await this.userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({
          // total_referral_bonus: 9,
          balance: () => `balance + ${amount}`,
          total_bonus: () => `total_bonus + ${amount}`,
          matching_bonus: () => `matching_bonus + ${amount}`,
        })
        .where('id = :id', { id: user.id })
        .execute();
      // post-transaction
      await this.transactionService.update(pre_transaction.id, {
        charge: 0,
        postBalance: (await this.findOne(id)).balance,
        amount,
        trx: generateTrx(),
        trxType: '+',
        details: 'matching_bonus',
      });
      // add bv log
      await this.bvLogService.create({
        user,
        amount,
        position,
        details: 'matching_bonus',
      });
    }
    return;
  }

  async binaryBonus(id: string, position: string) {
    const user = await this.findOne(id);
    const userTree = await this.getUserTree(id);
    if (userTree[1] && userTree[2] && userTree[0].binary_bonus == 0) {
      const amount = 4;
      // pre-transaction
      const pre_transaction = await this.transactionService.create({
        user: user,
        preBalance: user.balance,
      });
      // award bonus
      await this.userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({
          // total_referral_bonus: 9,
          balance: () => `balance + ${amount}`,
          total_bonus: () => `total_bonus + ${amount}`,
          binary_bonus: () => `binary_bonus + ${amount}`,
        })
        .where('id = :id', { id: user.id })
        .execute();
      // post-transaction
      await this.transactionService.update(pre_transaction.id, {
        charge: 0,
        postBalance: (await this.findOne(id)).balance,
        amount,
        trx: generateTrx(),
        trxType: '+',
        details: 'binary_bonus',
      });
      // add bv log
      await this.bvLogService.create({
        user,
        amount,
        position,
        details: 'binary_bonus',
      });
    }
    return;
  }

  async referralComission(id: any) {
    const user = await this.findOne(id);
    if (user.referrer) {
      const referral_comission = await this.getComission(
        user.plan.bv,
        user.referrer.plan.referralBonus,
      );

      // check if the referrer has a lower plan
      if (user.referrer.plan.price < user.plan.price) {
        const higher_ref_comission = await this.getComission(
          referral_comission,
          user.referrer.plan.higherReferralBonus,
        );
        // pre-transaction
        const pre_transaction = await this.transactionService.create({
          user: user.referrer,
          preBalance: user.referrer.balance,
        });
        // award bonus
        await this.userRepository
          .createQueryBuilder('user')
          .update(User)
          .set({
            // total_referral_bonus: 9,
            balance: () => `balance + ${higher_ref_comission}`,
            total_referral_bonus: () =>
              `total_referral_bonus + ${higher_ref_comission}`,
          })
          .where('id = :id', { id: user.referrer.id })
          .execute();
        // post-transaction
        await this.transactionService.update(pre_transaction.id, {
          charge: 0,
          postBalance: (await this.findOne(user.referrer.id)).balance,
          amount: higher_ref_comission,
          trx: generateTrx(),
          trxType: '+',
          details: 'higher_ref_bonus',
        });
        // add bv log
        await this.bvLogService.create({
          user: user.referrer,
          amount: higher_ref_comission,
          position: user.position,
          details: 'higher_ref_bonus',
        });

        const upgrade_comission = await this.getComission(
          referral_comission,
          100 - user.referrer.plan.higherReferralBonus,
        );
        // pre-transaction
        const upgrade_pre_transaction = await this.transactionService.create({
          user: user.referrer,
          preBalance: (await this.findOne(user.referrer.id)).upgrade_wallet,
        });
        // award bonus
        await this.userRepository
          .createQueryBuilder('user')
          .update(User)
          .set({
            // total_referral_bonus: 9,
            upgrade_wallet: () => `upgrade_wallet + ${upgrade_comission}`,
          })
          .where('id = :id', { id: user.referrer.id })
          .execute();
        // post-transaction
        await this.transactionService.update(upgrade_pre_transaction.id, {
          charge: 0,
          postBalance: (await this.findOne(user.referrer.id)).upgrade_wallet,
          amount: upgrade_comission,
          trx: generateTrx(),
          trxType: '+',
          details: 'higher_ref_upgrade_comission',
        });
      } else {
        // pre-transaction
        const pre_transaction = await this.transactionService.create({
          user: user.referrer,
          preBalance: user.referrer.balance,
        });
        // award bonus
        await this.userRepository
          .createQueryBuilder('user')
          .update(User)
          .set({
            // total_referral_bonus: 9,
            balance: () => `balance + ${referral_comission}`,
            total_referral_bonus: () =>
              `total_referral_bonus + ${referral_comission}`,
          })
          .where('id = :id', { id: user.referrer.id })
          .execute();
        // post-transaction
        await this.transactionService.update(pre_transaction.id, {
          charge: 0,
          postBalance: (await this.findOne(user.referrer.id)).balance,
          amount: referral_comission,
          trx: generateTrx(),
          trxType: '+',
          details: 'referral_bonus',
        });
        // add bv log
        await this.bvLogService.create({
          user: user.referrer,
          amount: referral_comission,
          position: user.position,
          details: 'binary_bonus',
        });
      }
    } else return;
  }

  getComission(amount: number, percentge: number) {
    return (amount * percentge) / 100;
  }

  async updateBV(id: string) {
    // const reward = await getComission(bv, 15);
    const user = await this.findOne(id);
    if (user) {
      await this.binaryBonus(user.sponsor.id, user.position);
      await this.matchingBonus(user.referrer.id);

      if (user.referrer) {
        // check new user's position on referrer's tree to determine reward
        const referrerTree = await this.getUserTree(user.referrer.id);
        const userPositionOnReferrerTree = referrerTree.indexOf(user);
        let value: number, reward: number;

        if (user.referrer.total_bv_left > user.referrer.total_bv_right) {
          value = user.referrer.total_bv_right;
        } else {
          value = user.referrer.total_bv_left;
        }

        function between(x: number, min: number, max: number) {
          return x >= min && x <= max;
        }
        // 6th - 8th
        if (between(userPositionOnReferrerTree, 63, 510)) {
          reward = this.getComission(value, 5);
        }
        // 9th - 12th
        if (between(userPositionOnReferrerTree, 63, 510)) {
          reward = this.getComission(value, 3);
        }
        // 13th - 16th
        if (between(userPositionOnReferrerTree, 63, 510)) {
          reward = this.getComission(value, 2);
        }
        // 17th - 20th
        if (between(userPositionOnReferrerTree, 63, 510)) {
          reward = this.getComission(value, 1);
        }
        // 21th - 25th
        if (between(userPositionOnReferrerTree, 63, 510)) {
          reward = this.getComission(value, 0.5);
        }

        // pre-transaction
        const pre_transaction = await this.transactionService.create({
          user: user.referrer,
          preBalance: user.referrer.balance,
        });
        // award bonus
        await this.userRepository
          .createQueryBuilder('user')
          .update(User)
          .set({
            // total_referral_bonus: 9,
            balance: () => `balance + ${reward}`,
            total_bonus: () => `total_bonus + ${reward}`,
          })
          .where('id = :id', { id: user.referrer.id })
          .execute();
        // post-transaction
        await this.transactionService.update(pre_transaction.id, {
          charge: 0,
          postBalance: (await this.findOne(id)).balance,
          amount: reward,
          trx: generateTrx(),
          trxType: '+',
          details: 'group_sales_bonus',
        });
        // add bv log
        await this.bvLogService.create({
          user: user.referrer,
          amount: reward,
          position: user.position,
          details: 'group_sales_bonus',
        });
      }
    }
  }
}
