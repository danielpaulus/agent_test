import { Post, Body, Controller, Get } from '@nestjs/common';
import { ChecklyService } from './checkly.service';
import { AlertDto } from './alertDTO';

@Controller('checkly')
export class ChecklyController {
  constructor(private readonly checklyService: ChecklyService) {}

  @Post()
  async receiveAlert(@Body() alertData: AlertDto): Promise<string> {
    return this.checklyService.alertReceived(alertData);
  }
  @Get('alerts')
  async getAlerts(): Promise<any[]> {
    return this.checklyService.getAlerts();
  }
}
