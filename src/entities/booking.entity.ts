/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // bookingDate: Date;

  @Column()
  customerId: number;

  @Column()
  roomId: number;

  @Column()
  seatCount: number;

  @Column()
  bookingAmount: number;

  // @Column()
  // paymentId: number;
}
