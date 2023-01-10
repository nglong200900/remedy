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
  ClassSerializerInterceptor,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PostCategroriesService } from './post_categories.service';
import { CreatePostCategoryDto } from './dto/create-post_category.dto';
import { UpdatePostCategroryDto } from './dto/update-post_category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { postCategrogiesQuery } from './dto/post_categoriesQuery.dto';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { Public } from 'src/decorator/public.decorator';
@ApiTags('Post Categrory')
@Controller('post_categrories')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class PostCategroriesController {
  constructor(
    private readonly postCategroriesService: PostCategroriesService,
  ) {}

  @ApiBearerAuth('access-token')
  @Post()
  create(
    @Body() createPostCategroryDto: CreatePostCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.postCategroriesService.create(createPostCategroryDto, req);
  }

  @Get()
  @Public()
  findAll(@Query() query: postCategrogiesQuery) {
    return this.postCategroriesService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: number) {
    return this.postCategroriesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePostCategroryDto: UpdatePostCategroryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.postCategroriesService.update(id, updatePostCategroryDto, req);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.postCategroriesService.remove(id, req);
  }
}
