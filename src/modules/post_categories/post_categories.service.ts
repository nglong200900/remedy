import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Tags from 'src/tags.emun';
import { Repository } from 'typeorm';
import { CreatePostCategoryDto } from './dto/create-post_category.dto';
import { postCategrogiesQuery } from './dto/post_categoriesQuery.dto';
import { UpdatePostCategroryDto } from './dto/update-post_category.dto';
import { PostCategory } from './entities/post_category.entity';
import RequestWithUser from 'src/interface/requestWithUser.interface';

@Injectable()
export class PostCategroriesService {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
  ) {}

  async create(
    createPostCategoryDto: CreatePostCategoryDto,
    req: RequestWithUser,
  ) {
    try {
      const postCategory = await this.postCategoryRepository.findOneBy({
        name: createPostCategoryDto.name,
      });

      if (postCategory) {
        throw new HttpException(
          'Post category name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      createPostCategoryDto.created_by = req.user.id;
      await this.postCategoryRepository.save(createPostCategoryDto);
      return {
        message: 'Post category created successfully',
        data: createPostCategoryDto,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(query?: postCategrogiesQuery) {
    try {
      const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
      const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index

      //remove pagination from query to avoid repository conflict
      const removeKey = ['page', 'offset', 'limit', 'roleOptions'];
      removeKey.forEach((key) => {
        delete query[key];
      });

      const [list, totalCount] = await this.postCategoryRepository
        .createQueryBuilder(Tags.Post_categrories)
        .orderBy('post_categories.id', 'ASC')
        .skip(offset)
        .take(limit)
        .where(query)
        .getManyAndCount();

      //check if any item was found
      if (list.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'List of post categories',
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
      const postCategory = await this.postCategoryRepository
        .createQueryBuilder(Tags.Post_categrories)
        .setFindOptions({ relations: { fav_post: true } })
        .where('post_categories.id = :id', { id: id })
        .getOne();

      if (!postCategory) {
        throw new HttpException(
          'Post category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Post category details', data: postCategory };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: number,
    updatePostCategoryDto: UpdatePostCategroryDto,
    req: RequestWithUser,
  ) {
    try {
      const postCategory = await this.postCategoryRepository.findOneBy({
        id: id,
      });

      if (!postCategory) {
        throw new HttpException(
          'Post category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (postCategory.created_by !== req.user.id) {
        throw new HttpException(
          'Not allowed to update',
          HttpStatus.UNAUTHORIZED,
        );
      }

      updatePostCategoryDto.updated_by = req.user.id;
      await this.postCategoryRepository.update(id, updatePostCategoryDto);
      return {
        message: 'Post category updated successfully',
        data: updatePostCategoryDto,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number, req: RequestWithUser) {
    try {
      const postCategory = await this.postCategoryRepository.findOneBy({
        id: id,
      });

      if (!postCategory) {
        throw new HttpException(
          'Post category not found',
          HttpStatus.NOT_FOUND,
        );
      } else if (postCategory.created_by !== req.user.id) {
        throw new HttpException(
          'Post category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.postCategoryRepository.delete(id);
      return {
        message: 'Post category deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
