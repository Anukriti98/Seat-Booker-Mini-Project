import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'tiny.db.elephantsql.com',
      port: 5432,
      username: 'ohlcuyzy',
      password: 'guSVqC73nOetSnApisHJVHjwpffUk7z1',
      database: 'ohlcuyzy',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
