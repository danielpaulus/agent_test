import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChecklyController } from './checkly/checkly.controller';
import { ChecklyService } from './checkly/checkly.service';
import { DatabaseModule } from './knex/knex.module';
import { LokiAgentService } from './loki_agent/loki_agent.service';
import { ConversationService } from './conversation/conversation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, ChecklyController],
  providers: [
    AppService,
    ChecklyService,
    LokiAgentService,
    ConversationService,
  ],
})
export class AppModule {}
