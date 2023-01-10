import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Tags from 'src/tags.emun';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import {
  UseFilters,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { productCategoryQuery } from './dto/productCategoryQuery.dto';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { Public } from 'src/decorator/public.decorator';

@ApiTags('Product Category')
@Controller(Tags.Product_category)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiBearerAuth('access-token')
  @Post()
  create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productCategoryService.create(createProductCategoryDto, req);
  }

  @Get()
  @Public()
  findAll(@Query() query: productCategoryQuery) {
    return this.productCategoryService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: number) {
    return this.productCategoryService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productCategoryService.update(
      id,
      updateProductCategoryDto,
      req,
    );
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.productCategoryService.remove(id, req);
  }
}
