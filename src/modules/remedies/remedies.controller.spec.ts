import { Test, TestingModule } from '@nestjs/testing';
import { RemediesController } from './remedies.controller';
import { RemediesService } from './remedies.service';

describe('RemediesController', () => {
  let controller: RemediesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemediesController],
      providers: [RemediesService],
    }).compile();

    controller = module.get<RemediesController>(RemediesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
