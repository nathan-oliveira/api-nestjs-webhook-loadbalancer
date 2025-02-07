import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Rule } from 'src/modules/auth/enums/rule.enum';
import { RulesGuard } from 'src/modules/auth/guard/rules/rules.guard';
import { Rules } from 'src/modules/auth/guard/rules/rules.decorator';
import { JwtAuthGuard } from '../guard/jwt/jwt-auth.guard';

export const JwtAuth = (...rules: Rule[]) => {
  return applyDecorators(
    ApiBearerAuth('Bearer Token'),
    UseGuards(JwtAuthGuard, RulesGuard),
    Rules(...rules),
  );
};
