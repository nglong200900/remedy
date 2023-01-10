import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class FileExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    if (req.file) {
      if (
        !(
          req.file.mimetype.includes('jpeg') ||
          req.file.mimetype.includes('png')
        )
      ) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }
      return next.handle();
    } else {
      throw new HttpException('Not found file', HttpStatus.NOT_FOUND);
    }
  }
}
