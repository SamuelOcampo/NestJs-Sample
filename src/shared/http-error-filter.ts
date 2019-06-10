import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const { method, url } = request;

    const errorResponse = {
      code: status,
      path: url,
      method: method,
      message: exception.message.error || exception.message,
    };

    Logger.error(`${method} ${url}`, JSON.stringify(errorResponse), 'ExceptionFilter')

    response.status(404).json(errorResponse);
  }
}
