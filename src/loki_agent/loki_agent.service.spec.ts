import { Test, TestingModule } from '@nestjs/testing';
import { LokiAgentService } from './loki_agent.service';

describe('LokiAgentService', () => {
  let service: LokiAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LokiAgentService],
    }).compile();

    service = module.get<LokiAgentService>(LokiAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
