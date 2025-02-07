import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { AppModule } from '../src/modules/app.module';

describe('Validate user routes (e2e)', () => {
  let app: INestApplication;

  let userId: number;
  let token: string;

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

  describe('#POST /api/auth/login', () => {
    it('Doing jwt authentication and saving the token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          login: 'admin',
          password: 'admin',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      token = response.body.token;
    });
  });

  describe('#GET /api/users', () => {
    it('find all users - return 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('#POST /api/users', () => {
    it('create a user - return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: faker.person.fullName(),
          login: faker.internet.username(),
          password: faker.internet.password(),
          companyId: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('login');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('rule');

      userId = response.body.id;
    });
  });

  describe('#GET /api/users/:id', () => {
    it('find user by id - return 200', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('login');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('rule');
    });

    it('find company by invalid id - return 400', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#PUT /api/users/:id', () => {
    it('update a user - return 200', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: faker.internet.password(),
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('login');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('rule');
    });

    it('update an invalid user - return 400', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/null`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: faker.internet.password(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#PATCH /api/users/:id', () => {
    it('activate or deactivate a user - return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('activate or deactivate a user - return 400', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#DELETE /api/users/:id', () => {
    it('remove a user - return 200', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('remove an invalid company - return 400', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });
});
