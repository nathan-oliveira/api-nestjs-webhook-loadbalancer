import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { Rule } from 'src/modules/auth/enums/rule.enum';
import { ReadAuthDto } from 'src/modules/auth/dtos';

import { RULES_KEY } from './rules.decorator';

@Injectable()
export class RulesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRules = this.reflector.getAllAndOverride<Rule[]>(RULES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRules) return true;

    const { user }: { user: ReadAuthDto } = context.switchToHttp().getRequest();
    const isRuleValid = requiredRules.some((rule) => user.rule === rule);

    if (!isRuleValid) throw new UnauthorizedException();
    return isRuleValid;
  }
}
