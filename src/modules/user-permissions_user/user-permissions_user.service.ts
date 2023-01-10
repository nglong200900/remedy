import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserPermissionsUserDto } from './dto/create-user-permissions_user.dto';
import { UpdateUserPermissionsUserDto } from './dto/update-user-permissions_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPermissionsUser } from './entities/user-permissions_user.entity';
import { Repository } from 'typeorm';
import { isEmpty } from 'class-validator';
import { userQuery } from 'src/modules/user-permissions_user/dto/userQuery.dto';
import { UserPermissionsRole } from '../user-permissions_role/entities/user-permissions_role.entity';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Remedy } from '../remedies/entities/remedy.entity';
import { remedyQueryDto } from '../remedies/dto/remedyQuery.dto';
import { Post } from '../posts/entities/post.entity';
import { UploadFileService } from '../upload_file/upload_file.service';
import { BufferedFile } from '../minIO/file.model';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import Tags from 'src/tags.emun';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class UserPermissionsUserService {
  constructor(
    @InjectRepository(UserPermissionsUser)
    private readonly userRepository: Repository<UserPermissionsUser>,
    @InjectRepository(UserPermissionsRole)
    private readonly roleRepository: Repository<UserPermissionsRole>,
    @InjectRepository(Remedy)
    private readonly remedyRepository: Repository<Remedy>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private uploadFileService: UploadFileService,
  ) {}

  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.userRepository.findOneBy({ id });
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }
  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const user = await this.userRepository.findOneBy({ id });
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, {
      currentHashedRefreshToken,
    });
  }
  async create(User: CreateUserPermissionsUserDto) {
    try {
      //check for duplicated email
      if (await this.userRepository.findOneBy({ email: User.email })) {
        throw new HttpException(
          'This email has already existed',
          HttpStatus.BAD_REQUEST,
        );
      }
      User.password = await bcrypt.hash(User.password, 10);
      if (User.role) {
        await this.roleRepository
          .findOneByOrFail({
            id: parseInt(User.role.toString()),
          })
          .catch(() => {
            throw new HttpException(
              'Role doesnt exist, choose another role',
              HttpStatus.NOT_FOUND,
            );
          });
      }
      await this.userRepository.save(User);

      return {
        message: 'User created successfully',
        data: User,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOneUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user != null && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new HttpException(
        'email or password wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(offset?: number, limit?: number) {
    const list = await this.userRepository.find({
      order: { id: 'ASC' },
      skip: offset,
      take: limit,
      relations: {
        role: true,
      },
    });

    //check if any item was found
    if (list.length === 0) {
      throw new HttpException('None was found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'List of users',
      data: list,
    };
  }

  async searchUser(query?: userQuery) {
    const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
    const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index
    //remove pagination from query to avoid repository conflict
    const removeKey = ['page', 'offset', 'limit', 'roleOption', 'avatar'];
    removeKey.forEach((key) => {
      delete query[key];
    });

    try {
      const [list, totalCount] = await this.userRepository
        .createQueryBuilder('user')
        .orderBy('user.id', 'ASC')
        .skip(offset)
        .take(limit)
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.avatar', 'avatar')
        .select(['user', 'role.name', 'avatar.url'])
        .where(query)
        .getManyAndCount();

      //check if any item was found
      if (list.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'List of users',
        data: list,
        pageInfo: {
          page: offset / limit + 1,
          count: list.length,
          lastPage: Math.ceil(totalCount / limit),
          totalCount: totalCount,
        },
      };
    } catch (error) {
      throw new HttpException('None was found', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: number) {
    if (!(await this.userRepository.findOneBy({ id: id }))) {
      throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
    }
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.avatar', 'avatar')
        .select(['user', 'role.name', 'avatar.url'])
        .where({ id: id })
        .getOne();

      return {
        message: 'User found',
        data: user,
      };
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    User: UpdateUserPermissionsUserDto,
    req: RequestWithUser,
  ) {
    const user = await this.userRepository.findOneBy({ id: id });
    //check if given id has a user
    if (user && user.id === req.user.id) {
      if (User.birthday) {
        //format user input on birthday
        const [day, month, year] = User.birthday.split('/');

        const date = new Date(+year, +month - 1, +day + 1);
        User.birthday = date.toISOString();
      }
      if (User.role) {
        await this.roleRepository
          .findOneByOrFail({
            id: parseInt(User.role.toString()),
          })
          .catch(() => {
            throw new HttpException(
              'Role doesnt exist, choose another role',
              HttpStatus.NOT_FOUND,
            );
          });
      }
      if (User.password) {
        User.password = await bcrypt.hash(User.password, 10);
      }
      //update user's update time
      User.updated_at = new Date();
      await this.userRepository.update(id, User);

      return {
        message: 'User updated',
      };
    }

    throw new HttpException(`User ${id} not found`, HttpStatus.BAD_REQUEST);
  }

  async addFavRemedies(userId: number, remedyId: number, req: RequestWithUser) {
    const user = await this.userRepository
      .createQueryBuilder(Tags.User)
      .leftJoinAndSelect('user.fav_remedies', 'remedies')
      .select(['user', 'remedies'])
      .where('user.id = :id', { id: userId })
      .getOne();

    const foundRemedy = await this.remedyRepository.findOneBy({ id: remedyId });

    if (user) {
      if (isEmpty(user.fav_remedies)) {
        user.fav_remedies = new Array<Remedy>();
      }

      if (!foundRemedy) {
        throw new HttpException('Remedy not found', HttpStatus.NOT_FOUND);
      } else if (
        //check the list for duplicates
        user.fav_remedies.some((remedy) => remedy.id === foundRemedy.id)
      ) {
        throw new HttpException(
          'Remedy already favorited',
          HttpStatus.NOT_FOUND,
        );
      }

      user.fav_remedies.push(foundRemedy);

      user.updated_by = req.user.id;
      await this.userRepository.save(user);
      return {
        message: 'Remedy added successfully',
        data: user.fav_remedies,
      };
    }

    throw new HttpException(`User ${userId} not found`, HttpStatus.NOT_FOUND);
  }

  async addFavPosts(userId: number, PostId: number, req: RequestWithUser) {
    const user = await this.userRepository
      .createQueryBuilder(Tags.User)
      .leftJoinAndSelect('user.fav_posts', 'fav_posts')
      .select(['user', 'fav_posts.id', 'fav_posts.title'])
      .where('user.id = :id', { id: userId })
      .getOne();
    const foundPost = await this.postRepository.findOneBy({ id: PostId });

    if (user) {
      if (isEmpty(user.fav_posts)) {
        user.fav_posts = new Array<Post>();
      }

      if (!foundPost) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      } else if (
        //check the list for duplicates
        user.fav_posts.some((post) => post.id === foundPost.id)
      ) {
        throw new HttpException('Post already favorited', HttpStatus.NOT_FOUND);
      }

      user.fav_posts.push(foundPost);

      user.updated_by = req.user.id;
      await this.userRepository.save(user);
      return {
        message: 'Post added successfully',
        data: user.fav_posts,
      };
    }

    throw new HttpException(`User ${userId} not found`, HttpStatus.NOT_FOUND);
  }

  async addFavProduct(userId: number, productId: number, req: RequestWithUser) {
    const user = await this.userRepository
      .createQueryBuilder(Tags.User)
      .leftJoinAndSelect('user.fav_product', 'fav_product')
      .select(['user', 'fav_product.id', 'fav_product.name'])
      .where('user.id = :id', { id: userId })
      .getOne();
    const foundProduct = await this.productRepository.findOneBy({
      id: productId,
    });

    if (user) {
      if (isEmpty(user.fav_product)) {
        user.fav_product = new Array<Product>();
      }

      if (!foundProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      } else if (
        //check the list for duplicates
        user.fav_product.some((product) => product.id === foundProduct.id)
      ) {
        throw new HttpException(
          'Product already favorited',
          HttpStatus.NOT_FOUND,
        );
      }

      user.fav_product.push(foundProduct);

      user.updated_by = req.user.id;
      await this.userRepository.save(user);
      return {
        message: 'Product added successfully',
        data: user.fav_posts,
      };
    }

    throw new HttpException(`User ${userId} not found`, HttpStatus.NOT_FOUND);
  }

  async removeFavRemedies(
    userId: number,
    remedyId: number,
    req: RequestWithUser,
  ) {
    const user = await this.userRepository
      .createQueryBuilder(Tags.User)
      .leftJoinAndSelect('user.fav_remedies', 'remedies')
      .select(['user', 'remedies.id', 'remedies.name'])
      .where('user.id = :id', { id: userId })
      .getOne();

    if (user) {
      //in case of fav_remedies returns undefined => replace with an empty array
      if (isEmpty(user.fav_remedies)) {
        user.fav_remedies = new Array<Remedy>();
      }

      if (
        user.fav_remedies.filter((remedy) => remedy.id === remedyId).length == 0
      ) {
        throw new HttpException('Remedy not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newFavRemedies = user.fav_remedies.filter(
        (remedy) => remedy.id != remedyId,
      );

      //replace the existing favorites list with the new favorites list
      user.fav_remedies = newFavRemedies;

      user.updated_by = req.user.id;
      await this.userRepository.save(user);
      return {
        message: 'Successfully removed from list',
      };
    }
    throw new HttpException(`User ${userId} not found`, HttpStatus.NOT_FOUND);
  }

  async removeFavPosts(userId: number, PostId: number, req: RequestWithUser) {
    const user = await this.userRepository
      .createQueryBuilder(Tags.User)
      .leftJoinAndSelect('user.fav_posts', 'fav_posts')
      .select(['user', 'fav_posts.id', 'fav_posts.title'])
      .where('user.id = :id', { id: userId })
      .getOne();
    if (user) {
      //in case of fav_posts returns undefined => replace with an empty array
      if (isEmpty(user.fav_posts)) {
        user.fav_posts = new Array<Post>();
      }

      if (user.fav_posts.filter((post) => post.id === PostId).length == 0) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newFavPosts = user.fav_posts.filter((post) => post.id != PostId);

      //replace the existing favorites list with the new favorites list
      user.fav_posts = newFavPosts;

      user.updated_by = req.user.id;
      await this.userRepository.save(user);
      return {
        message: 'Successfully removed from list',
      };
    }
    throw new HttpException(`User ${userId} not found`, HttpStatus.NOT_FOUND);
  }

  async removeFavProduct(
    userId: number,
    productId: number,
    req: RequestWithUser,
  ) {
    const user = await this.userRepository
      .createQueryBuilder(Tags.User)
      .leftJoinAndSelect('user.fav_product', 'fav_product')
      .select(['user', 'fav_product.id', 'fav_product.name'])
      .where('user.id = :id', { id: userId })
      .getOne();
    if (user) {
      //in case of fav_product returns undefined => replace with an empty array
      if (isEmpty(user.fav_product)) {
        user.fav_product = new Array<Product>();
      }

      if (
        user.fav_product.filter((product) => product.id === productId).length ==
        0
      ) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      //making a new list excluding the desired element to be removed
      const newFavProduct = user.fav_product.filter(
        (product) => product.id != productId,
      );

      //replace the existing favorites list with the new favorites list
      user.fav_product = newFavProduct;

      user.updated_by = req.user.id;
      await this.userRepository.save(user);
      return {
        message: 'Successfully removed from list',
      };
    }
    throw new HttpException(`User ${userId} not found`, HttpStatus.NOT_FOUND);
  }

  async searchFavRemedies(userId: number, query: remedyQueryDto) {
    delete query.page;
    delete query.limit;
    let result;

    // iterate through query object to query with each key value
    for (const [key, value] of Object.entries(query)) {
      result = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .innerJoinAndSelect('user.fav_remedies', 'fav_remedies')
        .select(['user.id', 'user.username'])
        .setFindOptions({
          relations: { fav_remedies: true },
        })
        .andWhere(`user__user_fav_remedies.${key.toString()} ILIKE :value`, {
          value: `%${value}%`,
        })
        .getMany();
    }

    if (result) {
      if (result.length === 0) {
        throw new HttpException('None was found', HttpStatus.NOT_FOUND);
      }
    } else {
      throw new HttpException('None was found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Query successfully',
      data: result,
    };
  }

  async addAvatar(image: BufferedFile, req: RequestWithUser) {
    try {
      const user = await this.userRepository
        .createQueryBuilder(Tags.User)
        .leftJoinAndSelect('user.avatar', 'avatar')
        .select(['user', 'avatar.id', 'avatar.url'])
        .where('user.id = :id', { id: req.user.id })
        .getOne();
      const avatar = await this.uploadFileService.upload(image, req);

      user.avatar = avatar.data;
      await this.userRepository.save(user);

      return { message: 'Avatar successfully added' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async removeAvatar(req: RequestWithUser) {
    try {
      const user = await this.userRepository
        .createQueryBuilder(Tags.User)
        .leftJoinAndSelect('user.avatar', 'avatar')
        .select(['user', 'avatar.id', 'avatar.url'])
        .where('user.id = :id', { id: req.user.id })
        .getOne();
      if (!user.avatar) {
        throw new HttpException('User has no avatar', HttpStatus.NOT_FOUND);
      }

      await this.uploadFileService.remove(user.avatar.id, req);
      user.avatar = null; //set value from undefined to null
      await this.userRepository.save(user);

      return { message: 'Avatar successfully removed' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number, req: RequestWithUser) {
    //check if given id has a user
    const user = await this.userRepository.findOneBy({ id: id });
    if (user && user.id === req.user.id) {
      await this.userRepository.delete({ id: id });
      //confirming deleted user
      return {
        message: 'User deleted successfully',
      };
    }
    throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }
}
