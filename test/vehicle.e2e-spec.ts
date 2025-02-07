import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { AppModule } from '../src/modules/app.module';

describe('Vehicle (e2e)', () => {
  let app: INestApplication;

  let vehicleId: number;
  let vehicleVin: string;
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

  describe('#GET /api/vehicles', () => {
    it('find all vehicles - return 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/vehicles')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });
  });

  describe('#POST /api/vehicles', () => {
    it('create a vehicle - return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/vehicles')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          license: faker.vehicle.vrm(),
          vin: faker.vehicle.vin(),
          companyId: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('license');
      expect(response.body).toHaveProperty('vin');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('lat');
      expect(response.body).toHaveProperty('long');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('fuelLevel');

      vehicleId = response.body.id;
      vehicleVin = response.body.vin;
    });
  });

  describe('#GET /api/vehicles/:id', () => {
    it('#GET /api/vehicles/:id - return 200', async () => {
      const response = await request(app.getHttpServer())
        .get(`/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('license');
      expect(response.body).toHaveProperty('vin');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('lat');
      expect(response.body).toHaveProperty('long');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('fuelLevel');
    });

    it('find company by invalid id - return 400', async () => {
      const response = await request(app.getHttpServer())
        .get(`/vehicles/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#PUT /api/vehicles/:id', () => {
    it('update vehicle - return 200', async () => {
      const response = await request(app.getHttpServer())
        .put(`/vehicles/${vehicleId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          license: faker.vehicle.vrm(),
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('license');
      expect(response.body).toHaveProperty('vin');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('lat');
      expect(response.body).toHaveProperty('long');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('fuelLevel');
    });

    it('update an invalid vehicle - return 400', async () => {
      const response = await request(app.getHttpServer())
        .put(`/vehicles/null`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          license: faker.vehicle.vrm(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#POST /api/vehicles/callback', () => {
    it('external vehicle callback route (basic token) - return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/vehicles/callback')
        .set('Accept', 'application/json')
        .set(
          'Authorization',
          `Basic ${Buffer.from('admin:admin').toString('base64')}`,
        )
        .send({
          vin: vehicleVin,
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('license');
      expect(response.body).toHaveProperty('vin');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('lat');
      expect(response.body).toHaveProperty('long');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('fuelLevel');
    });
  });

  describe('#PATCH /api/vehicles/:id', () => {
    it('activate or deactivate a user - return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('license');
      expect(response.body).toHaveProperty('vin');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('lat');
      expect(response.body).toHaveProperty('long');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('fuelLevel');
    });

    it('activate or deactivate user - return 400', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/vehicles/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('#DELETE /api/vehicles/:id', () => {
    it('remove a user - return 200', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('remove an invalid vehicle - return 400', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/vehicles/null`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });
  });
});
