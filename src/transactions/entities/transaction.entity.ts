import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user: User) => user.transactions, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: User;

  @Column('int', { nullable: true })
  amount: number;

  @Column('int', { nullable: true })
  charge: number;

  @Column('int', { nullable: true })
  postBalance: number;

  @Column('int')
  preBalance: number;

  @Column('text', { nullable: true })
  trx: string;

  @Column('text', { nullable: true })
  trxType: string;

  @Column('text', { nullable: true })
  details: string;
}
