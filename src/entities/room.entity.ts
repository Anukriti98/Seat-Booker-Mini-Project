/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum RoomType {
  RESTAURANT = 'restaurant',
  FILM = 'film',
  AIRPLANE = 'airplane',
  CONFERENCE = 'conference',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dimension: string;

  @Column()
  rowLength: number;

  @Column()
  userId: number;

  @Column({ default: 0 })
  standardPrice: number;

  @Column({ default: 0 })
  availableSeats: number;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.RESTAURANT,
  })
  roomType: RoomType;
}
