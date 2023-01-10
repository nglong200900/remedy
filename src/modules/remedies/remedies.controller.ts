import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseFilters,
  UseInterceptors,
  UploadedFile,
  Req,
  UploadedFiles,
  ClassSerializerInterceptor,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { RemediesService } from './remedies.service';
import { CreateRemedyDto } from './dto/create-remedy.dto';
import { UpdateRemedyDto } from './dto/update-remedy.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import Tags from 'src/tags.emun';
import { remedyQueryDto } from './dto/remedyQuery.dto';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { ApiFile, ApiMultiFile } from 'src/decorator/apibody.decorator';
import { FileExtender } from 'src/interceptors/FileExtender.interceptor';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minIO/file.model';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { FilesExtender } from 'src/interceptors/FilesExtender.interceptor';
import { Public } from 'src/decorator/public.decorator';
import { remedyOption } from './dto/remedyOption.dto';
@ApiTags('Remedy') // set up swagger tag for remedies
@Controller(Tags.Remedies)
@UseFilters(HttpExceptionFilter)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class RemediesController {
  constructor(private readonly remediesService: RemediesService) {}

  @ApiBearerAuth('access-token')
  @ApiBody({
    type: CreateRemedyDto,
  })
  @Post()
  create(
    @Body() createRemedyDto: CreateRemedyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.remediesService.create(createRemedyDto, req);
  }

  @Get()
  @Public()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  findAll(@Query() query: remedyQueryDto) {
    return this.remediesService.getAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: remedyOption) {
    return this.remediesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/addfavCategory')
  @ApiBody({ type: Number })
  addFavRemedy(
    @Param('id', ParseIntPipe) id: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.remediesService.addCategory(id, categoryId);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/removefavCategory')
  @ApiBody({ type: Number })
  removeFavRemedy(
    @Param('id', ParseIntPipe) id: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.remediesService.removeCategory(id, categoryId);
  }

  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('addimage')
  addImage(
    @UploadedFile('file') image: BufferedFile,
    @Req() req: RequestWithUser,
    @Query('remedyId') remedyId: number,
  ) {
    return this.remediesService.addImage(image, req, remedyId);
  }

  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FilesExtender)
  @UseInterceptors(FilesInterceptor('files'))
  @Patch('addimages')
  addImages(
    @UploadedFiles() images: Array<BufferedFile>,
    @Req() req: RequestWithUser,
    @Query('remedyId') remedyId: number,
  ) {
    return this.remediesService.addImages(images, req, remedyId);
  }

  @ApiBearerAuth('access-token')
  @Patch('removeimage')
  removeAvatar(
    @Req() req: RequestWithUser,
    @Query('remedyId') remedyId: number,
    @Query('imageId') imageId: number,
  ) {
    return this.remediesService.removeImage(req, remedyId, imageId);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRemedyDto: UpdateRemedyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.remediesService.update(id, updateRemedyDto, req);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.remediesService.remove(id, req);
  }
}
