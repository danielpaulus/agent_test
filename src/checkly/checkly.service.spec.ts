import { Test, TestingModule } from '@nestjs/testing';
import { ChecklyService } from './checkly.service';

describe('ChecklyService', () => {
  let service: ChecklyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChecklyService],
    }).compile();

    service = module.get<ChecklyService>(ChecklyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
