import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import Tags from 'src/tags.emun';
import { Repository } from 'typeorm';
import { BufferedFile } from '../minIO/file.model';
import { PostCategory } from '../post_categories/entities/post_category.entity';
import { UploadFile } from '../upload_file/entities/upload_file.entity';
import { UploadFileService } from '../upload_file/upload_file.service';
import { CreatePostDto } from './dto/create-post.dto';
import { postQuery } from './dto/postQuery.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly post: Repository<Post>,
    @InjectRepository(PostCategory)
    private readonly postCategrory: Repository<PostCategory>,
    private uploadFileService: UploadFileService,
  ) {}
  async create(createPostDto: CreatePostDto, req: RequestWithUser) {
    try {
      createPostDto.created_by = req.user.id;
      await this.post.save(createPostDto);

      return {
        message: 'Post created successfully',
        data: createPostDto,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(query: postQuery) {
    try {
      const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
      const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index
      const select = [
        'posts',
        'category.id',
        'category.name',
        'images.id',
        'images.url',
        'user.id',
        'user.email',
      ];
      //remove pagination from query to avoid repository conflict
      const removeKey = [
        'page',
        'offset',
        'limit',
        'roleOptions',
        'user',
        'images',
        'post_category',
      ];
      removeKey.forEach((key) => {
        delete query[key];
      });
      const [list, totalCount] = await this.post
        .createQueryBuilder(Tags.Post)
        .orderBy('posts.id', 'ASC')
        .skip(offset)
        .take(limit)
        .leftJoinAndSelect('posts.user', 'user')
        .leftJoinAndSelect('posts.post_category', 'category')
        .leftJoinAndSelect('posts.images', 'images')
        .select(select)
        .where(query)
        .getManyAndCount();
      //check if RequestWithUser item was found
      if (list.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'List of Posts',
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
    const data = await this.post
      .createQueryBuilder(Tags.Post)
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('posts.post_category', 'category')
      .leftJoinAndSelect('posts.images', 'images')
      .select([
        'posts',
        'user.id',
        'user.email',
        'category.id',
        'category.name',
        'images.id',
        'images.url',
      ])
      .where('posts.id = :id', { id: id })
      .getOne();
    if (data) {
      return { data: data };
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto, req: RequestWithUser) {
    try {
      const Post = await this.post.findOneBy({ id });
      if (Post && Post.created_by === req.user.id) {
        updatePostDto.created_by = req.user.id;
        await this.post.update(id, updatePostDto);
        return { message: 'Post updated successfully' };
      } else {
        throw new HttpException('Your post not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || 404);
    }
  }

  async addMultipleFiles(
    id: number,
    files: Array<BufferedFile>,
    req: RequestWithUser,
  ) {
    const post = await this.post
      .createQueryBuilder(Tags.Post)
      .leftJoinAndSelect('posts.images', 'images')
      .select(['posts', 'images.id', 'images.url'])
      .where('posts.id = :id', { id: id })
      .getOne();
    if (post && post.created_by === req.user.id) {
      const list = await this.uploadFileService.uploadMulti(files, req);

      for (const file of list) {
        post.images.push(file);
      }
      await this.post.save(post);
      return { data: list };
    } else {
      throw new HttpException('Upload failed', HttpStatus.BAD_REQUEST);
    }
  }

  async addCategory(
    postId: number,
    postCategoryId: number,
    req: RequestWithUser,
  ) {
    const post = await this.post
      .createQueryBuilder(Tags.Post)
      .leftJoinAndSelect('posts.post_category', 'category')
      .select(['posts', 'category.id', 'category.name'])
      .where('posts.id = :id', { id: postId })
      .getOne();
    const foundCategory = await this.postCategrory.findOneBy({
      id: postCategoryId,
    });

    if (post) {
      if (post.created_by != req.user.id) {
        throw new HttpException(
          'Not allowed to add a category',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (isEmpty(post.post_category)) {
        post.post_category = new Array<PostCategory>();
      }

      if (!foundCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      } else if (
        //check the list for duplicates
        post.post_category.some((category) => category.id === foundCategory.id)
      ) {
        throw new HttpException(
          'Category already added to post',
          HttpStatus.BAD_REQUEST,
        );
      }

      post.post_category.push(foundCategory);

      post.updated_by = req.user.id;
      await this.post.save(post);
      return {
        message: 'Category added successfully',
        data: post.post_category,
      };
    }

    throw new HttpException(`Post ${postId} not found`, HttpStatus.NOT_FOUND);
  }

  async removeFile(id: number, fileId: number, req: RequestWithUser) {
    const post = await this.post
      .createQueryBuilder(Tags.Post)
      .leftJoinAndSelect('posts.images', 'images')
      .select(['posts', 'images.id', 'images.url'])
      .where('posts.id = :id', { id: id })
      .getOne();
    if (post && post.created_by === req.user.id) {
      if (post.created_by != req.user.id) {
        throw new HttpException(
          'Not allowed to remove a file',
          HttpStatus.UNAUTHORIZED,
        );
      }

      //in case of images returns undefined => replace with an empty array
      if (isEmpty(post.images)) {
        post.images = new Array<UploadFile>();
      }

      if (post.images.filter((images) => images.id === fileId).length == 0) {
        throw new HttpException('Images not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newImages = post.images.filter((images) => images.id != fileId);

      //replace the existing favorites list with the new favorites list
      post.images = newImages;
      await this.uploadFileService.remove(fileId, req);

      post.updated_by = req.user.id;
      await this.post.save(post);
      return {
        message: 'Successfully removed images',
      };
    }

    throw new HttpException(`Post ${id} not found`, HttpStatus.NOT_FOUND);
  }

  async removeCategory(
    postId: number,
    postCategoryId: number,
    req: RequestWithUser,
  ) {
    const post = await this.post
      .createQueryBuilder(Tags.Post)
      .leftJoinAndSelect('posts.post_category', 'category')
      .select(['posts', 'category.id', 'category.name'])
      .where('posts.id = :id', { id: postId })
      .getOne();

    if (post) {
      if (post.created_by != req.user.id) {
        throw new HttpException(
          'Not allowed to remove a category',
          HttpStatus.UNAUTHORIZED,
        );
      }

      //in case of post_category returns undefined => replace with an empty array
      if (isEmpty(post.post_category)) {
        post.post_category = new Array<PostCategory>();
      }

      if (
        post.post_category.filter((category) => category.id === postCategoryId)
          .length == 0
      ) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newCategories = post.post_category.filter(
        (category) => category.id != postCategoryId,
      );

      //replace the existing favorites list with the new favorites list
      post.post_category = newCategories;

      post.updated_by = req.user.id;
      await this.post.save(post);
      return {
        message: 'Successfully removed category',
      };
    }

    throw new HttpException(`Post ${postId} not found`, HttpStatus.NOT_FOUND);
  }

  async remove(id: number, req: RequestWithUser) {
    try {
      const post = await this.post.findOneBy({ id });
      if (post && post.created_by === req.user.id) {
        await this.post.delete(id);
        return { message: 'Post deleted successfully' };
      } else {
        throw new HttpException('Your post not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
