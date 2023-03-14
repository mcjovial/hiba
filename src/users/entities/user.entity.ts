import { Exclude, Transform, TransformFnParams } from 'class-transformer';
import { Role } from 'src/common/enums';
import { Deposit } from 'src/deposits/entities/deposit.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Withdrawal } from 'src/withdrawals/entities/withdrawal.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
  static createQueryBuilder(arg0: string) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('text', { array: true, nullable: true })
  roles: Role[];

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

  @ManyToOne(() => Plan, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  plan: Plan;

  @Column({ type: 'enum', enum: Position, nullable: true })
  position: string;

  @Column('decimal', { default: 0 })
  balance: number;

  @Column('decimal', { default: 0 })
  total_referral_bonus: number;

  @Column('decimal', { default: 0 })
  total_bonus: number;

  // @Column('int', { default: 0 })
  // totalBV: number;

  @Column('decimal', { default: 0 })
  total_bv_left: number;

  @Column('decimal', { default: 0 })
  total_bv_right: number;

  @Column('decimal', { default: 0 })
  upgrade_wallet: number;

  @Column('decimal', { default: 0 })
  shopping_wallet: number;

  @Column('decimal', { default: 0 })
  total_investment: number;

  @Column('decimal', { default: 0 })
  matching_bonus: number;

  @Column('decimal', { default: 0 })
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

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}
