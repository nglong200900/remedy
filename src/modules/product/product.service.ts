import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { productQuery } from './dto/productQuery.dto';
import { ProductCategory } from '../product_category/entities/product_category.entity';
import { isEmpty } from 'class-validator';
import { BufferedFile } from '../minIO/file.model';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { UploadFileService } from '../upload_file/upload_file.service';
import { UploadFile } from '../upload_file/entities/upload_file.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    private uploadFileService: UploadFileService,
  ) {}

  async create(createProductDto: CreateProductDto, req: RequestWithUser) {
    try {
      try {
        createProductDto.created_by = req.user.id;
        await this.productRepository.save(createProductDto);
      } catch (error) {
        throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'Product created successfully',
        data: createProductDto,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(query: productQuery) {
    try {
      const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
      const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index
      //remove pagination from query to avoid repository conflict
      const removeKey = [
        'page',
        'offset',
        'limit',
        'roleOptions',
        'user',
        'images',
        'product_category',
      ];
      removeKey.forEach((key) => {
        delete query[key];
      });

      const [list, totalCount] = await this.productRepository
        .createQueryBuilder('product')
        .orderBy('product.id', 'ASC')
        .skip(offset)
        .take(limit)
        .leftJoinAndSelect('product.product_category', 'category')
        .leftJoinAndSelect('product.user', 'user')
        .leftJoinAndSelect('product.images', 'images')
        .setFindOptions({
          relations: { product_category: true },
        })
        .select([
          'product.id',
          'product.name',
          'product.link',
          'product.description',
          'product.extract',
          'product.composition',
          'product.precautions',
          'product.price',
          'user.id',
          'user.email',
          'images.id',
          'images.url',
          'product__product_product_category.id',
          'product__product_product_category.name',
        ])
        .where(query)
        .orWhere('product.name ILIKE :name', {
          name: `%${query.name}%`,
        })
        .getManyAndCount();

      //check if any item was found
      if (list.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'List of products',
        data: list,
        pageInfo: {
          page: offset / limit + 1,
          count: list.length,
          lastPage: Math.ceil(totalCount / limit),
          totalCount: totalCount,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.product_category', 'category')
        .leftJoinAndSelect('product.user', 'user')
        .leftJoinAndSelect('product.images', 'images')
        .setFindOptions({
          relations: { product_category: true },
        })
        .select([
          'product.id',
          'product.name',
          'product.link',
          'product.description',
          'product.extract',
          'product.composition',
          'product.precautions',
          'product.price',
          'user.id',
          'user.email',
          'images.id',
          'images.url',
          'product__product_product_category.id',
          'product__product_product_category.name',
        ])
        .where('product.id = :id', { id: id })
        .getOne();

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Product details', data: product };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    req: RequestWithUser,
  ) {
    try {
      const product = await this.productRepository.findOneBy({ id: id });
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      } else {
        if (product.created_by !== req.user.id) {
          throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
      }
      updateProductDto.updated_by = req.user.id;
      await this.productRepository.update(id, updateProductDto);
      return { message: 'Product updated successfully' };
    } catch (error) {
      throw new HttpException(error.message, error.status || 404);
    }
  }

  async addMultipleFiles(
    id: number,
    files: Array<BufferedFile>,
    req: RequestWithUser,
  ) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .setFindOptions({
        relations: { product_category: true },
      })
      .select([
        'product.id',
        'product.name',
        'product.created_by',
        'images.id',
        'images.url',
      ])
      .where('product.id = :id', { id: id })
      .getOne();

    if (product && product.created_by === req.user.id) {
      const list = await this.uploadFileService.uploadMulti(files, req);
      for (const file of list) {
        product.images.push(file);
      }
      await this.productRepository.save(product);
      return { data: product.images };
    } else {
      throw new HttpException('Upload failed', HttpStatus.BAD_REQUEST);
    }
  }

  async addCategory(
    productId: number,
    productCategoryId: number,
    req: RequestWithUser,
  ) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.product_category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .setFindOptions({
        relations: { product_category: true },
      })
      .select([
        'product.id',
        'product.name',
        'product.created_by',
        'images.id',
        'images.url',
        'product__product_product_category.id',
        'product__product_product_category.name',
      ])
      .where('product.id = :id', { id: productId })
      .getOne();

    const foundCategory = await this.productCategoryRepository.findOneBy({
      id: productCategoryId,
    });

    if (product && product.created_by === req.user.id) {
      if (isEmpty(product.product_category)) {
        product.product_category = new Array<ProductCategory>();
      }

      if (!foundCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      } else if (
        //check the list for duplicates
        product.product_category.some(
          (category) => category.id === foundCategory.id,
        )
      ) {
        throw new HttpException(
          'Category already added to product',
          HttpStatus.BAD_REQUEST,
        );
      }

      product.product_category.push(foundCategory);

      await this.productRepository.save(product);
      return {
        message: 'Category added successfully',
        data: product.product_category,
      };
    }

    throw new HttpException(
      `Product ${productId} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async removeCategory(
    productId: number,
    productCategoryId: number,
    req: RequestWithUser,
  ) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.product_category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .setFindOptions({
        relations: { product_category: true },
      })
      .select([
        'product.id',
        'product.name',
        'product.created_by',
        'images.id',
        'images.url',
        'product__product_product_category.id',
        'product__product_product_category.name',
      ])
      .where('product.id = :id', { id: productId })
      .getOne();

    if (product && product.created_by === req.user.id) {
      //in case of fav_remedies returns undefined => replace with an empty array
      if (isEmpty(product.product_category)) {
        product.product_category = new Array<ProductCategory>();
      }

      if (
        product.product_category.filter(
          (category) => category.id === productCategoryId,
        ).length == 0
      ) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newCategories = product.product_category.filter(
        (category) => category.id != productCategoryId,
      );

      //replace the existing favorites list with the new favorites list
      product.product_category = newCategories;

      await this.productRepository.save(product);
      return {
        message: 'Successfully removed category',
      };
    }

    throw new HttpException(
      `Product ${productId} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async removeFile(productId: number, fileId: number, req: RequestWithUser) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.product_category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .setFindOptions({
        relations: { product_category: true },
      })
      .select([
        'product.id',
        'product.name',
        'product.created_by',
        'images.id',
        'images.url',
        'product__product_product_category.id',
        'product__product_product_category.name',
      ])
      .where('product.id = :id', { id: productId })
      .getOne();

    if (product && product.created_by === req.user.id) {
      //in case of images returns undefined => replace with an empty array
      if (isEmpty(product.images)) {
        product.images = new Array<UploadFile>();
      }

      if (product.images.filter((images) => images.id === fileId).length == 0) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newImages = product.images.filter((images) => images.id != fileId);

      //replace the existing favorites list with the new favorites list
      product.images = newImages;
      await this.uploadFileService.remove(fileId, req);
      await this.productRepository.save(product);
      return {
        message: 'Successfully removed images',
      };
    }

    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number, req: RequestWithUser) {
    try {
      const product = await this.productRepository.findOneBy({ id: id });
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      } else {
        if (product.created_by !== req.user.id) {
          throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
      }

      await this.productRepository.delete(id);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
