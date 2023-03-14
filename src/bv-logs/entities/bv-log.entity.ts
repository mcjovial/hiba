import { Position, User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BvLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user: User) => user.transactions, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: Position })
  position: string;

  @Column('decimal', { nullable: true })
  amount: number;

  @Column('text', { nullable: true })
  details: string;
}
