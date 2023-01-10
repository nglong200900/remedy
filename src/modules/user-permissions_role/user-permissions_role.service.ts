import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

import { roleQuery } from 'src/modules/user-permissions_role/dto/roleQuery.dto';
import { Repository } from 'typeorm';
import { CreateUserPermissionsRoleDto } from './dto/create-user-permissions_role.dto';
import { UpdateUserPermissionsRoleDto } from './dto/update-user-permissions_role.dto';
import { UserPermissionsRole } from './entities/user-permissions_role.entity';
import RequestWithUser from 'src/interface/requestWithUser.interface';

@Injectable()
export class UserPermissionsRoleService {
  constructor(
    @InjectRepository(UserPermissionsRole)
    private readonly roleRepository: Repository<UserPermissionsRole>,
  ) {}

  async create(Role: CreateUserPermissionsRoleDto, req: RequestWithUser) {
    try {
      //check for duplicate role names
      if (await this.roleRepository.findOneBy({ name: Role.name })) {
        throw new HttpException(
          `Role '${Role.name}' already existed`,
          HttpStatus.BAD_REQUEST,
        );
      }

      Role.created_by = req.user.id;
      await this.roleRepository.save(Role);
      return {
        message: 'Role created successfully',
        data: Role,
      };
    } catch (error) {
      throw new HttpException('Role creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(offset?: number, limit?: number) {
    const list = await this.roleRepository.find({
      order: { id: 'ASC' },
      skip: offset,
      take: limit,
    });

    //check if any item was found
    if (list.length === 0) {
      throw new HttpException('None was found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'User deleted successfully',
      data: list,
    };
  }

  async searchRole(query?: roleQuery) {
    const limit = query.limit || parseInt(process.env.PAGE_LIMIT);
    const offset = (query.page - 1) * limit || 0; //jump to object location without needing to specify an index

    //remove pagination from query to avoid repository conflict
    const removeKey = ['page', 'offset', 'limit'];
    removeKey.forEach((key) => {
      delete query[key];
    });

    const [list, totalCount] = await this.roleRepository
      .createQueryBuilder('role')
      .orderBy('role.id', 'ASC')
      .skip(offset)
      .take(limit)
      .where(query)
      .getManyAndCount();

    //check if any item was found
    if (list.length === 0) {
      throw new HttpException('None was found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Query successfully',
      data: list,
      pageInfo: {
        page: offset / limit + 1,
        count: list.length,
        lastPage: Math.ceil(totalCount / limit),
        totalCount: totalCount,
      },
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository
      .findOneByOrFail({ id: id })
      .catch(() => {
        throw new HttpException(`Role ${id} not found`, HttpStatus.NOT_FOUND);
      });

    return {
      message: 'Role found',
      data: role,
    };
  }

  async update(
    id: number,
    Role: UpdateUserPermissionsRoleDto,
    req: RequestWithUser,
  ) {
    return await this.roleRepository
      .findOneByOrFail({ id: id })
      .catch(() => {
        throw new HttpException(
          `Role ${id} was not found`,
          HttpStatus.NOT_FOUND,
        );
      })
      .then(async () => {
        Role.updated_by = req.user.id;
        await this.roleRepository.update(id, Role);
        return {
          message: 'Role updated successfully',
        };
      });
  }

  async remove(id: number, req: RequestWithUser) {
    const role = await this.roleRepository.findOneBy({ id: id });
    if (role && role.created_by === req.user.id) {
      await this.roleRepository.delete(id);
      return {
        message: 'Role deleted successfully',
      };
    }

    throw new HttpException(`Role ${id} not found`, HttpStatus.NOT_FOUND);
  }
}
