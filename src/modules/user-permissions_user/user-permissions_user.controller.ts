import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { UserPermissionsUserService } from './user-permissions_user.service';
import { CreateUserPermissionsUserDto } from './dto/create-user-permissions_user.dto';
import { UpdateUserPermissionsUserDto } from './dto/update-user-permissions_user.dto';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import {
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common/decorators';
import Tags from 'src/tags.emun';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserPermissionsUser } from './entities/user-permissions_user.entity';
import { userQuery } from 'src/modules/user-permissions_user/dto/userQuery.dto';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { remedyQueryDto } from '../remedies/dto/remedyQuery.dto';
import { BufferedFile } from '../minIO/file.model';
import { ApiFile } from 'src/decorator/apibody.decorator';
import { FileExtender } from 'src/interceptors/FileExtender.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from 'src/interface/requestWithUser.interface';
import { Public } from 'src/decorator/public.decorator';
import { userOption } from './dto/userOption.dto';

@ApiTags('User')
@Controller(Tags.User)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserPermissionsUserController {
  constructor(
    private readonly userPermissionsUserService: UserPermissionsUserService,
  ) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiResponse({
    description: 'create a user',
    type: UserPermissionsUser,
    status: 201,
  })
  create(@Body() User: CreateUserPermissionsUserDto) {
    return this.userPermissionsUserService.create(User);
  }

  @Get()
  @Public()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Query() query?: userQuery) {
    return this.userPermissionsUserService.searchUser(query);
  }

  @Get('/searchfavremedies')
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  searchFavRemedy(
    @Req() req: RequestWithUser,
    @Query() query?: remedyQueryDto,
  ) {
    return this.userPermissionsUserService.searchFavRemedies(
      req.user.id,
      query,
    );
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: userOption) {
    return this.userPermissionsUserService.findOne(id);
  }

  @Patch()
  @ApiBearerAuth('access-token')
  update(
    @Body() User: UpdateUserPermissionsUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.update(req.user.id, User, req);
  }

  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('addavatar')
  addAvatar(
    @UploadedFile('file') image: BufferedFile,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.addAvatar(image, req);
  }

  @ApiBearerAuth('access-token')
  @Patch('removeavatar')
  removeAvatar(@Req() req: RequestWithUser) {
    return this.userPermissionsUserService.removeAvatar(req);
  }

  @Patch('/addfavremedy')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: Number })
  addFavRemedy(
    @Body('remedyId', ParseIntPipe) remedyId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.addFavRemedies(
      req.user.id,
      remedyId,
      req,
    );
  }

  @Patch('/addfavpost')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: Number })
  addFavPost(
    @Body('postId', ParseIntPipe) postId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.addFavPosts(
      req.user.id,
      postId,
      req,
    );
  }

  @Patch('/addfavproduct')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: Number })
  addFavProduct(
    @Body('productId', ParseIntPipe) productId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.addFavProduct(
      req.user.id,
      productId,
      req,
    );
  }

  @Patch('/removefavremedy')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: Number })
  removeFavRemedy(
    @Body('remedyId', ParseIntPipe) remedyId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.removeFavRemedies(
      req.user.id,
      remedyId,
      req,
    );
  }

  @Patch('/removefavpost')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: Number })
  removeFavPosts(
    @Body('postId', ParseIntPipe) postId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.removeFavPosts(
      req.user.id,
      postId,
      req,
    );
  }
  @Patch('/removefavproduct')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: Number })
  removeFavProduct(
    @Body('productId', ParseIntPipe) productId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.userPermissionsUserService.removeFavProduct(
      req.user.id,
      productId,
      req,
    );
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.userPermissionsUserService.remove(id, req);
  }
}
