import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import LogsMiddleware from './middleware/logs.middleware';
import { MinioClientModule } from './modules/minIO/minio-client.module';
import { AuthModule } from './modules/auth/auth.module';
import { RemediesModule } from './modules/remedies/remedies.module';
import { RemedyCategoriesModule } from './modules/remedy_categories/remedy_categories.module';
import { UploadFileModule } from './modules/upload_file/upload_file.module';
import { UserPermissionsRoleModule } from './modules/user-permissions_role/user-permissions_role.module';
import { UserPermissionsUserModule } from './modules/user-permissions_user/user-permissions_user.module';
import { ProductModule } from './modules/product/product.module';
import { ProductCategoryModule } from './modules/product_category/product_category.module';
import { PostsModule } from './modules/posts/posts.module';
import { PostCategroriesModule } from './modules/post_categories/post_categories.module';

@Module({
  imports: [
    AuthModule,
    UserPermissionsUserModule,
    UserPermissionsRoleModule,
    RemediesModule,
    RemedyCategoriesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProductModule,
    ProductCategoryModule,
    UploadFileModule,
    MinioClientModule,
    PostsModule,
    PostCategroriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
