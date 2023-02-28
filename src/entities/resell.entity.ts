/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Resell {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  totalSteats: number;

  @Column()
  discountedPrice: number;

  @Column()
  customerEmail: string;
}
