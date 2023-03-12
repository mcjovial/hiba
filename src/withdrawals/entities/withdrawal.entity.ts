import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
}

@Entity()
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  trxn: string;
  @Column('int', { nullable: true })
  amount: number;
  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: string;
  @ManyToOne(() => User, (user: User) => user.withdrawals, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: string;
}
