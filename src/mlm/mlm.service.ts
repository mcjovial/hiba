import { Injectable } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MlmService {
  constructor(
    private readonly userService: UsersService,
    private readonly transactionService: TransactionsService,
  ) {}

  public async getComission(amount: number, percentge: number) {
    return (amount * percentge) / 100;
  }
}
