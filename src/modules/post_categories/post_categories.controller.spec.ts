import { Test, TestingModule } from '@nestjs/testing';
import { PostCategroriesController } from './post_categories.controller';
import { PostCategroriesService } from './post_categories.service';

describe('PostCategroriesController', () => {
  let controller: PostCategroriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCategroriesController],
      providers: [PostCategroriesService],
    }).compile();

    controller = module.get<PostCategroriesController>(
      PostCategroriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
