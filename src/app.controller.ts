import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MenuService } from './menu/menu.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private menuService: MenuService,
  ) {}

  @Get()
  getHello(): string {
    this.menuService.showMainMenu();
    return this.appService.getHello();
  }
}
