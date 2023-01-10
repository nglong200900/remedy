import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  Query,
  Req,
} from '@nestjs/common';
import { UploadFileService } from './upload_file.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import Tags from 'src/tags.emun';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minIO/file.model';
import { FileExtender } from 'src/interceptors/FileExtender.interceptor';
import { ApiFile, ApiMultiFile } from 'src/decorator/apibody.decorator';
import { FilesExtender } from 'src/interceptors/FilesExtender.interceptor';
import { UploadfileQueryDto } from './dto/uploadfile.query.dto';
import { Public } from 'src/decorator/public.decorator';

@ApiTags(Tags.UploadFile) // set up swagger tag for remedies
@Controller(Tags.UploadFile)
@UseFilters(HttpExceptionFilter)
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @ApiBearerAuth('access-token')
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile('file') image: BufferedFile,
    @Req() request: any,
  ) {
    return await this.uploadFileService.upload(image, request);
  }
  @ApiBearerAuth('access-token')
  @Post('multiple')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FilesExtender)
  @UseInterceptors(FilesInterceptor('files'))
  async UploadMultiple(
    @UploadedFiles() images: Array<BufferedFile>,
    @Req() request: any,
  ) {
    await this.uploadFileService.uploadMulti(images, request);
    return { message: 'success' };
  }

  @Get()
  @Public()
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async findAll(@Query() query: UploadfileQueryDto) {
    return await this.uploadFileService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: number) {
    return await this.uploadFileService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: number,
    @UploadedFile('file') image: BufferedFile,
    @Req() request: any,
  ) {
    return this.uploadFileService.update(id, image, request);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: number, @Req() request: any) {
    return this.uploadFileService.remove(id, request);
  }
}
