import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Tags from 'src/tags.emun';
import { Repository } from 'typeorm';
import { BufferedFile } from '../minIO/file.model';
import { MinioClientService } from '../minIO/minio-client.service';
import { UploadfileQueryDto } from './dto/uploadfile.query.dto';
import { UploadFile } from './entities/upload_file.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sizeOf = require('buffer-image-size');

@Injectable()
export class UploadFileService {
  constructor(
    @InjectRepository(UploadFile)
    private readonly uploadFile: Repository<UploadFile>,
    private minioClientService: MinioClientService,
  ) {}
  async upload(image: BufferedFile, req: any) {
    try {
      const dimensions = sizeOf(image.buffer); // get width and height from image buffer
      const uploaded_image = await this.minioClientService.upload(image, req);
      uploaded_image.data.height = dimensions.height;
      uploaded_image.data.width = dimensions.width;
      const data = await this.uploadFile.save(uploaded_image.data);
      return {
        message: 'uploaded successfully',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
  }

  async uploadMulti(images: Array<BufferedFile>, req: any) {
    const list: UploadFile[] = [];
    for (const image of images) {
      const data = await this.upload(image, req);
      list.push(data.data);
    }
    return list;
  }

  async findAll(query: UploadfileQueryDto) {
    const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
    const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index
    delete query.page;
    delete query.limit;

    const data = await this.uploadFile
      .createQueryBuilder(Tags.UploadFile)
      .setFindOptions({
        where: query,
      })
      .take(limit)
      .skip(offset)
      .getMany();

    if (data.length == 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      return { message: 'File list', data: data };
    }
  }

  async findOne(id: number) {
    const data = await this.uploadFile.findOneBy({ id });
    if (data) {
      return { message: 'File details', data: data };
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, image: BufferedFile, req: any) {
    const file = await this.uploadFile.findOneBy({ id });
    if (file && file.created_by == req.user.id) {
      this.minioClientService.delete(file.name); //delete file older in minio
      const uploaded_image = await this.minioClientService.upload(image, req); //upload new image
      const dimensions = sizeOf(image.buffer); // get width and height from image buffer
      uploaded_image.data.height = dimensions.height;
      uploaded_image.data.width = dimensions.width;
      await this.uploadFile.update(id, uploaded_image.data);
      return {
        message: 'update successfully',
      };
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: number, req: any) {
    const file = await this.uploadFile.findOneBy({ id });
    if (file && file.created_by == req.user.id) {
      await this.minioClientService.delete(file.name);
      await this.uploadFile.delete(id);
      return {
        message: 'deleted successfully',
      };
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
