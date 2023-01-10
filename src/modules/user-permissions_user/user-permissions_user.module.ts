import { Module } from '@nestjs/common';
import { UserPermissionsUserService } from './user-permissions_user.service';
import { UserPermissionsUserController } from './user-permissions_user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionsUser } from './entities/user-permissions_user.entity';
import { UserPermissionsRole } from 'src/modules/user-permissions_role/entities/user-permissions_role.entity';
import { Remedy } from '../remedies/entities/remedy.entity';
import { Post } from '../posts/entities/post.entity';
import { UploadFileModule } from '../upload_file/upload_file.module';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    UploadFileModule,
    TypeOrmModule.forFeature([
      UserPermissionsUser,
      UserPermissionsRole,
      Remedy,
      Product,
      Post,
    ]),
  ],
  exports: [UserPermissionsUserService],
  controllers: [UserPermissionsUserController],
  providers: [UserPermissionsUserService],
})
export class UserPermissionsUserModule {}
