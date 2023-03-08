import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  bv: number;

  @Column()
  coupon: number;

  @Column()
  referralBonus: number;

  @Column()
  treeBonus: number;

  @Column()
  higherReferralBonus: number;

  @Column()
  brandedDiscount: number;

  @Column()
  physicalDiscount: number;
}
