import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { AppModule } from '../src/modules/app.module';

describe('Validate company routes (e2e)', () => {
  let app: INestApplication;

  let companyId: number;
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

  describe('#GET /api/companies', () => {
    it('find all companies, return 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });
  });

  describe('#POST /api/companies', () => {
    it('creating a company - return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: faker.company.name(),
          address: faker.location.city(),
          phone: faker.phone.number(),
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');

      companyId = response.body.id;
    });
  });

  describe('#GET /api/companies/:id', () => {
    it('find company by id - return 200', async () => {
      const response = await request(app.getHttpServer())
        .get(`/companies/${companyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
    });

    it('find company by invalid id - return 400', async () => {
      const response = await request(app.getHttpServer())
        .get(`/companies/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#PUT /api/companies/:id', () => {
    it('update a company - return 200', async () => {
      const response = await request(app.getHttpServer())
        .put(`/companies/${companyId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          phone: faker.phone.number(),
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
    });

    it('update an invalid company - return 400', async () => {
      const response = await request(app.getHttpServer())
        .put(`/companies/null`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          phone: faker.phone.number(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#PATCH /api/companies/:id', () => {
    it('activate or deactivate a company - return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/companies/${companyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
    });

    it('activate or deactivate an invalid company - return 400', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/companies/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#DELETE /api/companies/:id', () => {
    it('remove a company - return 200', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/companies/${companyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('remove an invalid company - return 400', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/companies/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });
});
