import { Module } from '@nestjs/common';
import { PostCategroriesService } from './post_categories.service';
import { PostCategroriesController } from './post_categories.controller';
import { PostCategory } from './entities/post_category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  controllers: [PostCategroriesController],
  providers: [PostCategroriesService],
})
export class PostCategroriesModule {}
