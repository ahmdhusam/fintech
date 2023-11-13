import { Injectable, NestMiddleware } from '@nestjs/common';
import { xss } from 'express-xss-sanitizer';

@Injectable()
export class XSSMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    return xss()(req, res, next);
  }
}
