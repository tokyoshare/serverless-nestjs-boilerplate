import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Api')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @ApiResponse({ status: HttpStatus.OK, description: 'Ok' })
  getPing(): string {
    return this.appService.getPing();
  }
}
