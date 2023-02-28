import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, Booking])],
  providers: [MenuService],
  exports: [TypeOrmModule],
})
export class MenuModule {}
