import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { AppModule } from '../src/modules/app.module';

describe('Validate authentication routes (e2e)', () => {
  let app: INestApplication;

  const bodyUser = {
    name: faker.person.fullName(),
    login: faker.internet.username(),
    password: faker.internet.password(),
    companyId: 1,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('#POST /api/auth/signup', () => {
    it('Create an account, return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(bodyUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('login');
      expect(response.body).toHaveProperty('rule');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
    });

    it('Create account already registered, return 409', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .set('Accept', 'application/json')
        .send(bodyUser);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#POST /api/auth/login', () => {
    it('Access account, return 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          login: bodyUser.login,
          password: bodyUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expirationTime');
    });

    it('Invalid username or password, return 403', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          login: bodyUser.login,
          password: `${bodyUser.password}000`,
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });
});
