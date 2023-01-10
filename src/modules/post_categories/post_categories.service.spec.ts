import { Test, TestingModule } from '@nestjs/testing';
import { PostCategroriesService } from './post_categories.service';

describe('PostCategroriesService', () => {
  let service: PostCategroriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostCategroriesService],
    }).compile();

    service = module.get<PostCategroriesService>(PostCategroriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
