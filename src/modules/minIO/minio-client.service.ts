import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import RequestWithUser from 'src/interface/requestWithUser.interface';

@Injectable()
export class MinioClientService {
  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
    private configService: ConfigService,
  ) {}

  public async upload(
    file: BufferedFile,
    req: RequestWithUser,
    baseBucket: string = this.configService.get('MINIO_BUCKET'),
  ) {
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const hashedFileName = crypto
      .createHash('md5')
      .update(Date.now().toString())
      .digest('hex'); //hash of the filename to date now
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    ); // get ext from file
    const filenameHash = hashedFileName + ext;
    const url = `${this.configService.get(
      'MINIO_ENDPOINT',
    )}:${this.configService.get('MINIO_PORT')}/${this.configService.get(
      'MINIO_BUCKET',
    )}/${filenameHash}`;
    this.client.putObject(
      baseBucket,
      filenameHash,
      file.buffer,
      metaData,
      function (err: Error) {
        // put new object to minIO bucket
        if (err)
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
      },
    );
    const data = {
      name: filenameHash,
      ext: ext,
      mime: file.mimetype,
      url: url,
      size: file.size,
      provider: 'MinIO',
      width: 0,
      height: 0,
      created_by: req.user.id,
    };
    return {
      data,
    };
  }

  async delete(
    objetName: string,
    baseBucket: string = this.configService.get('MINIO_BUCKET'),
  ) {
    this.client.removeObject(baseBucket, objetName, function (err: Error) {
      if (err)
        throw new HttpException(
          'Oops Something wrong happend',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}
