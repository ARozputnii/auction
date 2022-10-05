import { Controller, Get } from '@nestjs/common';
import { SkipAuth } from './auth/skip-auth.decorator';

@Controller()
export class AppController {
  @SkipAuth()
  @Get('profile')
  getProfile() {
    return 'ok';
  }
}
