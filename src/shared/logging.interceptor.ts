import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogginInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    return call$.pipe(
      tap(() =>
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        ),
      ),
    );
  }
}
