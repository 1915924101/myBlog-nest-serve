import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          return this.transformDates(data);
        }
        return data;
      }),
    );
  }

  private transformDates(obj: any): any {
    // 如果是数组，递归处理每个元素
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformDates(item));
    }

    // 如果是对象，递归处理每个属性
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 处理Date类型字段
          if (obj[key] instanceof Date) {
            obj[key] = this.formatDate(obj[key]);
          }
          // 递归处理嵌套对象
          else if (typeof obj[key] === 'object') {
            obj[key] = this.transformDates(obj[key]);
          }
        }
      }
    }

    return obj;
  }

  // 格式化日期为yyyy-MM-DD hh:mm:ss格式
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}