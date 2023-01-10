import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UsePipes,
  UseFilters,
  Req,
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserPermissionsRoleService } from './user-permissions_role.service';
import { CreateUserPermissionsRoleDto } from './dto/create-user-permissions_role.dto';
import { UpdateUserPermissionsRoleDto } from './dto/update-user-permissions_role.dto';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import Tags from 'src/tags.emun';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserPermissionsRole } from './entities/user-permissions_role.entity';
import { roleQuery } from 'src/modules/user-permissions_role/dto/roleQuery.dto';

import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/decorator/public.decorator';

@ApiTags('Role')
@Controller(Tags.Role)
@UseFilters(HttpExceptionFilter)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class UserPermissionsRoleController {
  constructor(
    private readonly userPermissionsRoleService: UserPermissionsRoleService,
  ) {}

  @ApiBearerAuth('access-token')
  @Post()
  @ApiResponse({
    description: 'create a role',
    type: UserPermissionsRole,
  })
  create(
    @Body() createUserPermissionsRoleDto: CreateUserPermissionsRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsRoleService.create(
      createUserPermissionsRoleDto,
      req,
    );
  }

  @Get()
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  findAll(@Query() query?: roleQuery) {
    return this.userPermissionsRoleService.searchRole(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userPermissionsRoleService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiBody({ type: UpdateUserPermissionsRoleDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserPermissionsRoleDto: UpdateUserPermissionsRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsRoleService.update(
      id,
      updateUserPermissionsRoleDto,
      req,
    );
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, req: RequestWithUser) {
    return this.userPermissionsRoleService.remove(id, req);
  }
}
