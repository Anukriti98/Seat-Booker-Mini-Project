import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MenuService } from './menu/menu.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // const response = await HttpSe
  //   .get('http://localhost:3000')
  //   .toPromise();
}
bootstrap();
