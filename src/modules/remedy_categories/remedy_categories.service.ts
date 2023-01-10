import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Tags from 'src/tags.emun';
import { Repository } from 'typeorm';
import { CreateRemedyCategoryDto } from './dto/create-remedy_category.dto';
import { UpdateRemedyCategoryDto } from './dto/update-remedy_category.dto';
import { RemedyCategory } from './entities/remedy_category.entity';
import { RemedyCategoryQueryDto } from './dto/remedy_categoriesQuery.dto';
import RequestWithUser from 'src/interface/requestWithUser.interface';

@Injectable()
export class RemedyCategoriesService {
  constructor(
    @InjectRepository(RemedyCategory)
    private readonly remedyCategory: Repository<RemedyCategory>,
  ) {}
  async create(
    createRemedyCategoryDto: CreateRemedyCategoryDto,
    req: RequestWithUser,
  ) {
    const check = await this.remedyCategory.findOne({
      where: { name: createRemedyCategoryDto.name },
    }); //find meredy_categories by name
    if (check) {
      // check name is exist
      throw new HttpException('Name is exist ', HttpStatus.BAD_REQUEST); // return BAD_REQUEST
    } else {
      createRemedyCategoryDto.created_by = req.user.id;
      await this.remedyCategory.save(createRemedyCategoryDto); // create new meredy_categories
      return {
        message: 'Remedy category created successfully',
      };
    }
  }

  async getAll(query: RemedyCategoryQueryDto) {
    try {
      const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
      const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index

      //remove pagination from query to avoid repository conflict
      const removeKey = ['page', 'offset', 'limit', 'roleOptions'];
      removeKey.forEach((key) => {
        delete query[key];
      });

      const [list, totalCount] = await this.remedyCategory
        .createQueryBuilder(Tags.Remedy_categories)
        .orderBy('remedy_categories.id', 'ASC')
        .skip(offset)
        .take(limit)
        .where(query)
        .getManyAndCount();

      //check if any item was found
      if (list.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'List of remedy categories',
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
      const remedyCategory = await this.remedyCategory
        .createQueryBuilder(Tags.Remedy_categories)
        .where('remedy_categories.id = :id', { id: id })
        .getOne();

      if (!remedyCategory) {
        throw new HttpException(
          'Remedy category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Remedy category details', data: remedyCategory };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: number,
    updateRemedyCategoryDto: UpdateRemedyCategoryDto,
    req: RequestWithUser,
  ) {
    const check = await this.remedyCategory.findOne({
      where: { name: updateRemedyCategoryDto.name },
    }); //find meredy_categories by name
    if (check) {
      // check name is exist
      throw new HttpException('Name is exist ', HttpStatus.BAD_REQUEST); // return BAD_REQUEST
    } else {
      const remedyCategory = await this.remedyCategory.findOneBy({ id: id });
      if (!remedyCategory) {
        throw new HttpException(
          'Remedy category not found',
          HttpStatus.NOT_FOUND,
        );
      } else if (remedyCategory.created_by != req.user.id) {
        throw new HttpException(
          'Not allowed to update',
          HttpStatus.UNAUTHORIZED,
        );
      }

      updateRemedyCategoryDto.updated_at = new Date(); // update update_at is date now
      updateRemedyCategoryDto.updated_by = req.user.id;
      const update = await this.remedyCategory.update(
        id,
        updateRemedyCategoryDto,
      );
      if (update.affected) {
        //check affected
        return {
          message: 'Remedy category updated successfully',
        }; //return ok request
      } else {
        throw new HttpException('Not found !', HttpStatus.NOT_FOUND); //return not found request
      }
    }
  }

  async remove(id: number, req: RequestWithUser) {
    try {
      const remedyCategory = await this.remedyCategory.findOneBy({
        id: id,
      });

      if (!remedyCategory) {
        throw new HttpException(
          'remedy category not found',
          HttpStatus.NOT_FOUND,
        );
      } else if (remedyCategory.created_by !== req.user.id) {
        throw new HttpException(
          'remedy category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.remedyCategory.delete(id);
      return {
        message: 'remedy category deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
