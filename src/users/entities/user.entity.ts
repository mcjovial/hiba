import { Transform, TransformFnParams } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  referrer: string;

  @Column({ nullable: true })
  sponsor?: string;

  @Column({ nullable: true })
  plan: string;

  @Column({ type: 'enum', enum: Position })
  position: string;

  @Column('int', { default: 0 })
  balance: number;

  @Column('int', { default: 0 })
  totalReferralBonus: number;

  @Column('int', { default: 0 })
  totalBonus: number;

  @Column('int', { default: 0 })
  totalBV: number;

  @Column('int', { default: 0 })
  totalBVLeft: number;

  @Column('int', { default: 0 })
  totalBVRight: number;

  @Column('int', { default: 0 })
  upgradeWallet: number;

  @Column('int', { default: 0 })
  shoppingWallet: number;

  @Column('int', { default: 0 })
  totalInvestment: number;

  @Column('int', { default: 0 })
  matchingBonus: number;

  @Column('int', { default: 0 })
  binaryBonus: number;

  @Column('boolean', { default: false })
  isHibaActive: boolean;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankAccountName: string;

  @Column({ nullable: true })
  bankName: string;
}
