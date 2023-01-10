import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { time, timeEnd } from 'console';
import { Request, Response, NextFunction } from 'express';

@Injectable()
class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP', { timestamp: true });
  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, headers } = request;
      const { statusCode, statusMessage } = response;

      const message = `${method} URL: ${headers.host}${originalUrl}   Statuscode: ${statusCode} ${statusMessage}   Timestamp:`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}

export default LogsMiddleware;
