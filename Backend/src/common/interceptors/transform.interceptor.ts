import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@common/interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;

        // If data is already wrapped in ApiResponse format, return as-is
        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data;
        }

        return {
          success: statusCode < 400,
          data,
          statusCode,
        };
      }),
    );
  }
}
