import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { ProductCategory } from './entities/product_category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { productCategoryQuery } from './dto/productCategoryQuery.dto';
import RequestWithUser from 'src/interface/requestWithUser.interface';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
    req: RequestWithUser,
  ) {
    try {
      const productCategory = await this.productCategoryRepository.findOneBy({
        name: createProductCategoryDto.name,
      });

      if (productCategory) {
        throw new HttpException(
          'Product category name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      createProductCategoryDto.created_by = req.user.id;
      await this.productCategoryRepository.save(createProductCategoryDto);
      return {
        message: 'Product category created successfully',
        data: createProductCategoryDto,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(query?: productCategoryQuery) {
    try {
      const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
      const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index

      //remove pagination from query to avoid repository conflict
      const removeKey = ['page', 'offset', 'limit', 'roleOptions'];
      removeKey.forEach((key) => {
        delete query[key];
      });

      const [list, totalCount] = await this.productCategoryRepository
        .createQueryBuilder('product_category')
        .orderBy('product_category.id', 'ASC')
        .skip(offset)
        .take(limit)
        .setFindOptions({ relations: { products: true } })
        .select([
          'product_category.id',
          'product_category.name',
          'product_category__product_category_products.id',
          'product_category__product_category_products.name',
        ])
        .where(query)
        .orWhere('product_category.name ILIKE :name', {
          name: `%${query.name}%`,
        })
        .getManyAndCount();

      //check if any item was found
      if (list.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'List of product categories',
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
      const productCategory = await this.productCategoryRepository
        .createQueryBuilder('product_category')
        .setFindOptions({ relations: { products: true } })
        .select([
          'product_category.id',
          'product_category.name',
          'product_category__product_category_products.id',
          'product_category__product_category_products.name',
        ])
        .where('product_category.id = :id', { id: id })
        .getOne();

      if (!productCategory) {
        throw new HttpException(
          'Product category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Product category details', data: productCategory };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
    req: RequestWithUser,
  ) {
    try {
      const productCategory = await this.productCategoryRepository.findOneBy({
        id: id,
      });

      if (productCategory.created_by != req.user.id) {
        throw new HttpException('Not allowed', HttpStatus.UNAUTHORIZED);
      } else if (!productCategory) {
        throw new HttpException(
          'Product category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      updateProductCategoryDto.updated_by = req.user.id;
      await this.productCategoryRepository.update(id, updateProductCategoryDto);
      return {
        message: 'Product category updated successfully',
        data: updateProductCategoryDto,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number, req: RequestWithUser) {
    try {
      const productCategory = await this.productCategoryRepository.findOneBy({
        id: id,
      });

      if (!productCategory) {
        throw new HttpException(
          'Product category not found',
          HttpStatus.NOT_FOUND,
        );
      } else if (productCategory.created_by !== req.user.id) {
        throw new HttpException(
          'Product category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.productCategoryRepository.delete(id);
      return {
        message: 'Product category deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
