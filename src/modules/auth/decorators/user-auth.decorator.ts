import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { LoginUserDto } from 'src/modules/auth/dtos';

export const UserAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return <LoginUserDto>req.user;
  },
);
