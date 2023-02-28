/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Booking } from './entities/booking.entity';
import { MenuService } from './menu/menu.service';
import { DataSource } from 'typeorm';
import { MenuModule } from './menu/menu.module';
import { Resell } from './entities/resell.entity';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'seat-booker-db.cgdpzbzq8oyv.us-east-1.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: 'SAM38726324',
      database: 'postgres',
      entities: [User, Room, Booking, Resell],
      autoLoadEntities: true,
      synchronize: true,
    }),
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService, MenuService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
