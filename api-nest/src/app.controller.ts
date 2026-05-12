import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Health check endpoint.
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Returns API status.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
