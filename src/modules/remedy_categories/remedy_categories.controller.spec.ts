import { Test, TestingModule } from '@nestjs/testing';
import { RemedyCategoriesController } from './remedy_categories.controller';
import { RemedyCategoriesService } from './remedy_categories.service';

describe('RemedyCategoriesController', () => {
  let controller: RemedyCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemedyCategoriesController],
      providers: [RemedyCategoriesService],
    }).compile();

    controller = module.get<RemedyCategoriesController>(RemedyCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
