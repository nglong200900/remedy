import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmpty } from 'class-validator';
import { map, Observable } from 'rxjs';
import { queryStringToJSON } from 'src/utils/querytojson';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const option = {
          user: 'false',
          images: 'false',
          post_category: 'false',
          remedy_category: 'false',
          product_category: 'false',
          role: 'false',
          avatar: 'false',
        };
        if (request._parsedUrl.query) {
          const query = queryStringToJSON(request._parsedUrl.query);

          //avoid key conflict between user's role and query role option
          for (const [key, value] of Object.entries(query)) {
            if (isEmpty(query['roleOption'])) {
              query['roleOption'] = 'false';
            }
            query['role'] = query['roleOption'];
          }
          delete query['roleOption'];

          for (const [key, value] of Object.entries(query)) {
            option[key] = value;
          }
        }
        for (const [key, value] of Object.entries(option)) {
          if (value === 'false') {
            if (Array.isArray(data.data)) {
              data.data?.forEach((object) => {
                //iterate through each properties (k => property, v => value)
                for (const [k, v] of Object.entries(object)) {
                  if (k === key) {
                    delete object[key];
                  }
                }
              });
            }
            if (typeof data.data === 'object') {
              for (const [k, v] of Object.entries(data.data)) {
                if (k === key) {
                  delete data.data[key];
                }
              }
            }
          }
        }

        return {
          data: data.data,
          pageInfo: data.pageInfo,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data.message,
          date: new Date(),
        };
      }),
    );
  }
}
