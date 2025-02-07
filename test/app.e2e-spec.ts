import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/modules/app.module';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('#GET /api', () => {
    request(app.getHttpServer())
      .get('/api')
      .end((err: Error, res: request.Response) => {
        expect(res.status).toBe(404);
        expect(res.body.statusCode).toBe(404);
        expect(res.body.message).toBe('Cannot GET /api');
      });
  });
});
