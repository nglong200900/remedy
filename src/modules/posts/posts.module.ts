import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import PostsController from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostCategory } from '../post_categories/entities/post_category.entity';
import { UploadFileModule } from '../upload_file/upload_file.module';
@Module({
  imports: [UploadFileModule, TypeOrmModule.forFeature([Post, PostCategory])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
