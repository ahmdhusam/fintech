import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../database/database.service';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
