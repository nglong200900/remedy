
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
    ) {}
    getHello(): any {
      throw new Error('Method not implemented.');
    }
    
}
