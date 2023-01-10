import { Module } from '@nestjs/common';
import { RemediesService } from './remedies.service';
import { RemediesController } from './remedies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remedy } from './entities/remedy.entity';
import { RemedyCategoriesModule } from '../remedy_categories/remedy_categories.module';
import { RemedyCategory } from '../remedy_categories/entities/remedy_category.entity';
import { UploadFileModule } from '../upload_file/upload_file.module';
@Module({
  imports: [
    RemedyCategoriesModule,
    UploadFileModule,
    TypeOrmModule.forFeature([Remedy, RemedyCategory]),
  ],
  controllers: [RemediesController],
  providers: [RemediesService],
})
export class RemediesModule {}
