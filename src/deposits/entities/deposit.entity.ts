import { Plan } from 'src/plans/entities/plan.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  purpose: string;
  @Column('int', { nullable: true })
  amount: number;
  @Column('text', { nullable: true })
  trxn: string;
  @ManyToOne(() => Plan, (plan: Plan) => plan.id, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  plan?: string;
  @ManyToOne(() => User, (user: User) => user.deposits, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: string;
}
