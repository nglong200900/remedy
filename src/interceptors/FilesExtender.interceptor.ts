import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class FilesExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    if (req.files) {
      for (const file of req.files) {
        if (
          !(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))
        ) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      return next.handle();
    } else {
      throw new HttpException('not found file', HttpStatus.NOT_FOUND);
    }
  }
}
