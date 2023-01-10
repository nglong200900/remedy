import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AuthModule } from './modules/auth/auth.module';
import { RemediesModule } from './modules/remedies/remedies.module';
import { RemedyCategoriesModule } from './modules/remedy_categories/remedy_categories.module';
import { UserPermissionsRoleModule } from './modules/user-permissions_role/user-permissions_role.module';
import { UserPermissionsUserModule } from './modules/user-permissions_user/user-permissions_user.module';
import { TransformationInterceptor } from './interceptors/response.interceptor';
import { ProductModule } from './modules/product/product.module';
import { ProductCategoryModule } from './modules/product_category/product_category.module';
import { UploadFileModule } from './modules/upload_file/upload_file.module';
import { ExcludeNullInterceptor } from './interceptors/ExcludeNull.interceptor';
import { PostsModule } from './modules/posts/posts.module';
import { PostCategroriesModule } from './modules/post_categories/post_categories.module';
import { FavoritedInterceptor } from './interceptors/Favorited.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(
    new ExcludeNullInterceptor(),
    new TransformationInterceptor(),
    new FavoritedInterceptor(),
  ); //order (exclude null values => transform response format)
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser()); //parser cookies
  //OpenApi / Swagger
  const config = new DocumentBuilder() //set up config swagger
    .setTitle('nt_clone')
    .setDescription('nt_clone desc')
    .setVersion('1.0')
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description:
          '[just text field] Please enter token in following format: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const options: SwaggerDocumentOptions = {
    include: [
      AppModule,
      UploadFileModule,
      RemediesModule,
      RemedyCategoriesModule,
      UserPermissionsRoleModule,
      UserPermissionsUserModule,
      ProductModule,
      ProductCategoryModule,
      AuthModule,
      PostsModule,
      PostCategroriesModule,
    ], //modules use for swagger
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/api', app, document); //http://localhost:5000/api
  await app.listen(process.env.PORT);
}
bootstrap();
