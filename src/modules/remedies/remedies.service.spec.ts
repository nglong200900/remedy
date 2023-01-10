import { Test, TestingModule } from '@nestjs/testing';
import { RemediesService } from './remedies.service';

describe('RemediesService', () => {
  let service: RemediesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemediesService],
    }).compile();

    service = module.get<RemediesService>(RemediesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
