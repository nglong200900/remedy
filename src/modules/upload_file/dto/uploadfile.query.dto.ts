import { IntersectionType } from '@nestjs/swagger';
import { PaginationParam } from 'src/utils/paginationParam';
import { CreateUploadFileDto } from './create-upload_file.dto';
export class UploadfileQueryDto extends IntersectionType(
  CreateUploadFileDto,
  PaginationParam,
) {}
