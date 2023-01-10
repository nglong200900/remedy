import { ApiBody } from '@nestjs/swagger';

export const ApiMultiFile =
  (fileName = 'files'): MethodDecorator =>
  (
    //send request files to server
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBody({
      type: 'multipart/form-data',
      required: true,
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

export const ApiFile =
  (fileName = 'file'): MethodDecorator =>
  (
    //send request file to server
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
