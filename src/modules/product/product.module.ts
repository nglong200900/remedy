import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from '../product_category/entities/product_category.entity';
import { UploadFileModule } from '../upload_file/upload_file.module';

@Module({
  imports: [
    UploadFileModule,
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductCategory]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
