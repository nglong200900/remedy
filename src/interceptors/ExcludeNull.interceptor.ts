import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        if (Array.isArray(data.data)) {
          data.data?.forEach((object) => {
            //iterate through each properties (k => property, v => value)
            for (const [key, value] of Object.entries(object)) {
              if (value === null) {
                delete object[key];
              }
              //checking for nested null values
              if (typeof value === 'object' && value != null) {
                for (const [k, v] of Object.entries(value)) {
                  if (v === null) {
                    delete value[k];
                  }
                }
              }
            }
          });
        }

        if (typeof data.data === 'object') {
          for (const [key, value] of Object.entries(data.data)) {
            if (value === null) {
              delete data.data[key];
            }
          }
        }
        return data;
      }),
    );
  }
}
