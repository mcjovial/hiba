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

  @Column({ type: 'decimal', nullable: true })
  amount: number;

  @Column({ type: 'decimal', nullable: true })
  charge: number;

  @Column({ type: 'decimal', nullable: true })
  postBalance: number;

  @Column('decimal', { nullable: true })
  preBalance: number;

  @Column('text', { nullable: true })
  trx: string;

  @Column('text', { nullable: true })
  trxType: string;

  @Column('text', { nullable: true })
  details: string;
}
