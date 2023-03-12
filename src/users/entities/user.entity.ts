import { Transform, TransformFnParams } from 'class-transformer';
import { Deposit } from 'src/deposits/entities/deposit.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Withdrawal } from 'src/withdrawals/entities/withdrawal.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Position {
  LEFT = 'left',
  RIGHT = 'right',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  contact: number;

  @OneToOne(() => User, (user: User) => user.id, {
    nullable: true,
    // eager: true,
    // cascade: true,
  })
  @JoinColumn()
  referrer: User;

  @OneToOne(() => User, (user: User) => user.id, {
    nullable: true,
    // eager: true,
    // cascade: true,
  })
  @JoinColumn()
  sponsor?: User;

  @OneToOne(() => Plan, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  plan: Plan;

  @Column({ type: 'enum', enum: Position })
  position: string;

  @Column('int', { default: 0 })
  balance: number;

  @Column('int', { default: 0 })
  total_referral_bonus: number;

  @Column('int', { default: 0 })
  total_bonus: number;

  // @Column('int', { default: 0 })
  // totalBV: number;

  @Column('int', { default: 0 })
  total_bv_left: number;

  @Column('int', { default: 0 })
  total_bv_right: number;

  @Column('int', { default: 0 })
  upgrade_wallet: number;

  @Column('int', { default: 0 })
  shopping_wallet: number;

  @Column('int', { default: 0 })
  total_investment: number;

  @Column('int', { default: 0 })
  matching_bonus: number;

  @Column('int', { default: 0 })
  binary_bonus: number;

  @Column('boolean', { default: false })
  isHibaActive: boolean;

  @Column('boolean', { default: true })
  isHibaUser: boolean;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankAccountName: string;

  @Column({ nullable: true })
  bankName: string;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.user)
  public transactions?: Transaction[];

  @OneToMany(() => Deposit, (deposit: Deposit) => deposit.user)
  public deposits?: Deposit[];

  @OneToMany(() => Withdrawal, (withdrawal: Withdrawal) => withdrawal.user)
  public withdrawals?: Withdrawal[];
}
