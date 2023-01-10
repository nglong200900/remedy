import { Module } from '@nestjs/common';
import { UploadFileService } from './upload_file.service';
import { UploadFileController } from './upload_file.controller';
import { MinioClientModule } from '../minIO/minio-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from './entities/upload_file.entity';

@Module({
  imports: [MinioClientModule, TypeOrmModule.forFeature([UploadFile])],
  controllers: [UploadFileController],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
