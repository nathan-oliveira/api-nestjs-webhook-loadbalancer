import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';

import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async authenticate(request: Request) {
    try {
      const token = request.headers['authorization'].split(' ')[1];
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [username, password] = decoded.split(':');
      if (!username || !password) return this.fail(401);
      const user = await this.authService.validateUser(username, password);
      const { id, companyId, active, rule } = user;
      return this.success({ id, companyId, active, rule });
    } catch (err) {
      return this.fail(err);
    }
  }
}
