import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { postQuery } from './dto/postQuery.dto';
import Tags from 'src/tags.emun';
import { ApiMultiFile } from 'src/decorator/apibody.decorator';
import { FilesExtender } from 'src/interceptors/FilesExtender.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minIO/file.model';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { Public } from 'src/decorator/public.decorator';
import { postOption } from './dto/postOption.dto';

@ApiTags('Post')
@Controller(Tags.Post)
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth('access-token')
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.create(createPostDto, req);
  }

  @Get()
  @Public()
  async findAll(@Query() query: postQuery) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: number, @Query() query: postOption) {
    return this.postsService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/addfavCategory')
  @ApiBody({ type: Number })
  addCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.addCategory(id, categoryId, req);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/addFiles')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FilesExtender)
  @UseInterceptors(FilesInterceptor('files'))
  addMultipleFiles(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() images: Array<BufferedFile>,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.addMultipleFiles(id, images, req);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/removefavCategory')
  @ApiBody({ type: Number })
  removeCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.removeCategory(id, categoryId, req);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/removeFiles')
  @ApiBody({ type: Number })
  removeFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body('fileId', ParseIntPipe) fileId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.removeFile(id, fileId, req);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.update(id, updatePostDto, req);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.postsService.remove(id, req);
  }
}
