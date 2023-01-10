import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Remedy } from '../remedies/entities/remedy.entity';
import { UserPermissionsRole } from '../user-permissions_role/entities/user-permissions_role.entity';
import { UserPermissionsUser } from '../user-permissions_user/entities/user-permissions_user.entity';
import { UserPermissionsUserModule } from '../user-permissions_user/user-permissions_user.module';
import { UserPermissionsUserService } from '../user-permissions_user/user-permissions_user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './strateries/jwt-refresh.strategy';
import { JwtStrategy } from './strateries/jwt.stratery';
import { LocalStrategy } from './strateries/local.strategy';
import { UploadFileModule } from '../upload_file/upload_file.module';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserPermissionsUser,
      UserPermissionsRole,
      Remedy,
      Product,
      Post,
    ]),
    PassportModule,
    UserPermissionsUserModule,
    JwtModule,
    UploadFileModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserPermissionsUserService,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
