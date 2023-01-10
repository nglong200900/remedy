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
  Req,
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RemedyCategoriesService } from './remedy_categories.service';
import { CreateRemedyCategoryDto } from './dto/create-remedy_category.dto';
import { UpdateRemedyCategoryDto } from './dto/update-remedy_category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Tags from 'src/tags.emun';
import { RemedyCategoryQueryDto } from './dto/remedy_categoriesQuery.dto';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/decorator/public.decorator';
@ApiTags('Remedy Categories') //set up swagger tag for remedy-categories
@Controller(Tags.Remedy_categories)
@UseFilters(HttpExceptionFilter)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class RemedyCategoriesController {
  constructor(
    private readonly remedyCategoriesService: RemedyCategoriesService,
  ) {}

  @ApiBearerAuth('access-token')
  @Post()
  create(
    @Body() createRemedyCategoryDto: CreateRemedyCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.remedyCategoriesService.create(createRemedyCategoryDto, req);
  }

  @Get()
  @Public()
  async findAll(@Query() query: RemedyCategoryQueryDto) {
    return this.remedyCategoriesService.getAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.remedyCategoriesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRemedyCategoryDto: UpdateRemedyCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.remedyCategoriesService.update(
      id,
      updateRemedyCategoryDto,
      req,
    );
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.remedyCategoriesService.remove(id, req);
  }
}
