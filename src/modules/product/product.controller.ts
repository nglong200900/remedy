import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import {
  Query,
  Req,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import Tags from 'src/tags.emun';
import { productQuery } from './dto/productQuery.dto';
import { ApiMultiFile } from 'src/decorator/apibody.decorator';
import { FilesExtender } from 'src/interceptors/FilesExtender.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minIO/file.model';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { Public } from 'src/decorator/public.decorator';
import { productOption } from './dto/productOption.dto';

@ApiTags('Product')
@Controller(Tags.Product)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth('access-token')
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productService.create(createProductDto, req);
  }

  @Get()
  @Public()
  findAll(@Query() query?: productQuery) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: productOption,
  ) {
    return this.productService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: RequestWithUser,
  ) {
    return this.productService.update(id, updateProductDto, req);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/addFiles')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FilesExtender)
  @UseInterceptors(FilesInterceptor('files'))
  async addFiles(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() images: Array<BufferedFile>,
    @Req() request: RequestWithUser,
  ) {
    return await this.productService.addMultipleFiles(id, images, request);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/addCategory')
  @ApiBody({ type: Number })
  addCategory(
    @Param('id', ParseIntPipe) productId: number,
    @Body('productCategoryId') productCategoryId: number,
    @Req() request: RequestWithUser,
  ) {
    return this.productService.addCategory(
      productId,
      productCategoryId,
      request,
    );
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/removeCateory')
  @ApiBody({ type: Number })
  removeCategory(
    @Param('id', ParseIntPipe) productId: number,
    @Body('productCategoryId') productCategoryId: number,
    @Req() request: RequestWithUser,
  ) {
    return this.productService.removeCategory(
      productId,
      productCategoryId,
      request,
    );
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/removeFiles')
  @ApiBody({ type: Number })
  removeFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body('fileId', ParseIntPipe) fileId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.productService.removeFile(id, fileId, req);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    return this.productService.remove(id, request);
  }
}
