import { Test, TestingModule } from '@nestjs/testing';
import { RemedyCategoriesService } from './remedy_categories.service';

describe('RemedyCategoriesService', () => {
  let service: RemedyCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemedyCategoriesService],
    }).compile();

    service = module.get<RemedyCategoriesService>(RemedyCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
