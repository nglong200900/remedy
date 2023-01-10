import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';
import { map, Observable } from 'rxjs';

export class Response<T> {
  data: T;
}

@Injectable()
export class FavoritedInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const jwt = new JwtService();
        if (request.method != 'GET' || !request.cookies.Authentication) {
          return data;
        }
        try {
          const auth = jwt.verify(request.cookies.Authentication, {
            secret: process.env.SECRET_KEY,
          });
          request.user = auth;
        } catch (error) {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        //get single
        if (typeof data.data === 'object') {
          for (const [key, value] of Object.entries(data.data)) {
            if (key === 'user' && Array.isArray(value)) {
              if (value.length === 0) {
                data.data.isFavorited = false;
              } else {
                for (const [k, v] of Object.entries(value)) {
                  if (typeof v === 'object') {
                    if (v['id'] === request.user.id) {
                      data.data.isFav = true;
                      break;
                    } else {
                      data.data.isFav = false;
                    }
                  }
                }
              }
            }
          }
        }

        //get list
        if (Array.isArray(data.data)) {
          data.data?.forEach((object) => {
            //iterate through each properties (k => property, v => value)
            for (const [key, value] of Object.entries(object)) {
              if (key === 'user' && Array.isArray(value)) {
                for (const [k, v] of Object.entries(value)) {
                  if (typeof v === 'object') {
                    if (v['id'] === request.user.id) {
                      object.isFav = true;
                      break;
                    } else {
                      object.isFav = false;
                    }
                  }
                }
              } else if (Array.isArray(object['user'])) {
                if (object['user'].length === 0) {
                  object.isFavorited = false;
                }
              }
            }
          });
        }
        return data;
      }),
    );
  }
}
