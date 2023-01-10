import { Module } from '@nestjs/common';
import { RemedyCategoriesService } from './remedy_categories.service';
import { RemedyCategoriesController } from './remedy_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemedyCategory } from './entities/remedy_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RemedyCategory])],
  controllers: [RemedyCategoriesController],
  providers: [RemedyCategoriesService],
})
export class RemedyCategoriesModule {}
