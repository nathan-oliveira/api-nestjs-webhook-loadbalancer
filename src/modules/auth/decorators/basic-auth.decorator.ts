import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';

import { Rule } from 'src/modules/auth/enums/rule.enum';
import { RulesGuard } from 'src/modules/auth/guard/rules/rules.guard';
import { Rules } from 'src/modules/auth/guard/rules/rules.decorator';

import { BasicAuthGuard } from '../guard/basic/basic-auth.guard';

export const BasicAuth = (...rules: Rule[]) => {
  return applyDecorators(
    ApiBasicAuth('Basic Token'),
    UseGuards(BasicAuthGuard, RulesGuard),
    Rules(...rules),
  );
};
