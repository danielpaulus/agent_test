import { Test, TestingModule } from '@nestjs/testing';
import { ChecklyController } from './checkly.controller';

describe('ChecklyController', () => {
  let controller: ChecklyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklyController],
    }).compile();

    controller = module.get<ChecklyController>(ChecklyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
