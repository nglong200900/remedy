import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRemedyDto } from './dto/create-remedy.dto';
import { UpdateRemedyDto } from './dto/update-remedy.dto';
import { Remedy } from './entities/remedy.entity';
import Tags from 'src/tags.emun';
import { remedyQueryDto } from './dto/remedyQuery.dto';
import { RemedyCategory } from '../remedy_categories/entities/remedy_category.entity';
import { BufferedFile } from '../minIO/file.model';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { UploadFileService } from '../upload_file/upload_file.service';
import { isEmpty } from 'class-validator';
@Injectable()
export class RemediesService {
  constructor(
    @InjectRepository(Remedy)
    private remedy: Repository<Remedy>,
    @InjectRepository(RemedyCategory)
    private readonly remedyCategory: Repository<RemedyCategory>,
    private uploadFileService: UploadFileService,
  ) {}
  async create(createRemedyDto: CreateRemedyDto, req: RequestWithUser) {
    createRemedyDto.created_by = req.user.id;
    const remedy = await this.remedy.save(createRemedyDto);
    if (remedy) {
      //create new meredy
      return {
        message: 'Remedy created successfully',
        data: createRemedyDto,
      };
    } else {
      throw new HttpException('Remedy not created!', HttpStatus.OK);
    }
  }

  async findOne(id: number) {
    const data = await this.remedy
      .createQueryBuilder(Tags.Remedies)
      .leftJoinAndSelect('remedies.user', 'user')
      .leftJoinAndSelect('remedies.images', 'images')
      .leftJoinAndSelect('remedies.remedy_category', 'category')
      .setFindOptions({
        relations: { user: true },
      })
      .select([
        'remedies',
        'user.id',
        'user.email',
        'images.id',
        'images.url',
        'category.id',
        'category.name',
      ])
      .where('remedies.id = :id', { id: id })
      .getOne();
    if (data) {
      return { data: data };
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(
    id: number,
    updateRemedyDto: UpdateRemedyDto,
    req: RequestWithUser,
  ) {
    const remedy = await this.remedy.findOneBy({ id: id });

    if (!remedy) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else if (remedy.created_by != req.user.id) {
      throw new HttpException('Not allowed to update', HttpStatus.UNAUTHORIZED);
    }

    updateRemedyDto.updated_at = new Date(); // update update_at is date now
    updateRemedyDto.updated_by = req.user.id;
    const update = await this.remedy.update(id, updateRemedyDto);

    if (update.affected) {
      //check affected
      return {
        message: 'Remedy updated successfully',
      }; //return ok request
    } else {
      throw new HttpException('Not found !', HttpStatus.NOT_FOUND); //return not found request
    }
  }

  async remove(id: number, req: RequestWithUser) {
    const remedy = await this.remedy.findOneBy({ id: id });
    if (remedy && remedy.created_by == req.user.id) {
      await this.remedy.delete(id); //delete meredy by id
      return {
        message: 'Remedy deleted successfully',
      };
    } else {
      throw new HttpException('Not found !', HttpStatus.NOT_FOUND); //retuen not found request
    }
  }

  async getAll(query: remedyQueryDto) {
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
        'remedy_category',
      ];
      removeKey.forEach((key) => {
        delete query[key];
      });

      const [list, totalCount] = await this.remedy
        .createQueryBuilder(Tags.Remedies)
        .orderBy('remedies.id', 'ASC')
        .skip(offset)
        .take(limit)
        .leftJoinAndSelect('remedies.user', 'user')
        .leftJoinAndSelect('remedies.images', 'images')
        .leftJoinAndSelect('remedies.remedy_category', 'category')
        .setFindOptions({
          relations: { user: true },
        })
        .select([
          'remedies',
          'user.id',
          'user.email',
          'images.id',
          'images.url',
          'category.id',
          'category.name',
        ])
        .where(query)
        .getManyAndCount();
      //check if RequestWithUser item was found
      if (list.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'List of remedies',
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

  async addCategory(remedyId: number, remedyCategoryId: number) {
    const remedy = await this.remedy
      .createQueryBuilder(Tags.Remedies)
      .leftJoinAndSelect('remedies.remedy_category', 'category')
      .select(['remedies', 'category.id', 'category.name'])
      .where('remedies.id = :id', { id: remedyId })
      .getOne();
    const foundCategory = await this.remedyCategory.findOneBy({
      id: remedyCategoryId,
    });

    if (remedy) {
      if (remedy.remedy_category) {
        remedy.remedy_category = new Array<RemedyCategory>();
      }

      if (!foundCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      } else if (
        //check the list for duplicates
        remedy.remedy_category.some(
          (category) => category.id === foundCategory.id,
        )
      ) {
        throw new HttpException(
          'Category already added to remedies',
          HttpStatus.BAD_REQUEST,
        );
      }

      remedy.remedy_category.push(foundCategory);

      await this.remedy.save(remedy);
      return {
        message: 'Category added successfully',
        data: remedy.remedy_category,
      };
    }

    throw new HttpException(
      `Remedy ${remedyId} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async removeCategory(remedyId: number, remedyCategoryId: number) {
    const remedy = await this.remedy
      .createQueryBuilder(Tags.Remedies)
      .leftJoinAndSelect('remedies.remedy_category', 'category')
      .select(['remedies', 'category.id', 'category.name'])
      .where('remedies.id = :id', { id: remedyId })
      .getOne();

    if (remedy) {
      //in case of remedy_category returns undefined => replace with an empty array
      if (isEmpty(remedy.remedy_category)) {
        remedy.remedy_category = new Array<RemedyCategory>();
      }

      if (
        remedy.remedy_category.filter(
          (category) => category.id === remedyCategoryId,
        ).length == 0
      ) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newCategories = remedy.remedy_category.filter(
        (category) => category.id != remedyCategoryId,
      );

      //replace the existing favorites list with the new favorites list
      remedy.remedy_category = newCategories;

      await this.remedy.save(remedy);
      return {
        message: 'Successfully removed category',
      };
    }

    throw new HttpException(
      `Remedy ${remedyId} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async addImage(image: BufferedFile, req: RequestWithUser, remedyId: number) {
    try {
      const remedy = await this.remedy
        .createQueryBuilder(Tags.Remedies)
        .leftJoinAndSelect('remedies.images', 'images')
        .select(['remedies', 'images.id'])
        .where('remedies.id = :id', { id: remedyId })
        .getOne();

      if (!remedy) {
        throw new HttpException('Remedy not found', HttpStatus.NOT_FOUND);
      } else if (remedy.created_by != req.user.id) {
        throw new HttpException(
          'Not allowed to add an image',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const images = await this.uploadFileService.upload(image, req);

      remedy.images.push(images.data);
      //update updated_by user id
      remedy.updated_by = req.user.id;
      await this.remedy.save(remedy);

      return { message: 'Image successfully added' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async addImages(
    images: Array<BufferedFile>,
    req: RequestWithUser,
    remedyId: number,
  ) {
    try {
      const remedy = await this.remedy
        .createQueryBuilder(Tags.Remedies)
        .leftJoinAndSelect('remedies.images', 'images')
        .select(['remedies', 'images.id'])
        .where('remedies.id = :id', { id: remedyId })
        .getOne();

      if (!remedy) {
        throw new HttpException('Remedy not found', HttpStatus.NOT_FOUND);
      } else if (remedy.created_by != req.user.id) {
        throw new HttpException(
          'Not allowed to add images',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (isEmpty(remedy.images)) {
        remedy.images = [];
      }

      const list = await this.uploadFileService.uploadMulti(images, req);

      for (const image of list) {
        remedy.images.push(image);
      }

      remedy.updated_by = req.user.id;
      await this.remedy.save(remedy);
      return { message: 'Images successfully added' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async removeImage(req: RequestWithUser, id: number, imageId: number) {
    try {
      const remedy = await this.remedy
        .createQueryBuilder(Tags.Remedies)
        .leftJoinAndSelect('remedies.images', 'images')
        .select(['remedies', 'images.id'])
        .where('remedies.id = :id', { id: id })
        .getOne();

      if (!remedy) {
        throw new HttpException('Remedy not found', HttpStatus.NOT_FOUND);
      } else if (remedy.created_by != req.user.id) {
        throw new HttpException(
          'Not allowed to remove an image',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (remedy.images.length === 0) {
        throw new HttpException('Remedy has no iamges', HttpStatus.NOT_FOUND);
      }

      const removeImage = await this.uploadFileService.findOne(imageId);

      const newImages = await remedy.images.filter(
        (iamges) => iamges.id != removeImage.data.id,
      );

      await this.uploadFileService.remove(removeImage.data.id, req);

      remedy.images = newImages;
      remedy.updated_by = req.user.id;
      await this.remedy.save(remedy);

      return { message: 'Image successfully removed' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
