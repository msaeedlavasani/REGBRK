/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users should register a new user (201)', async () => {
    const email = `e2e-${Date.now()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'E2E Test User' })
      .expect(201);

    const body = response.body as {
      id: string;
      email: string;
      fullName: string;
    };

    expect(body.email).toBe(email);
    expect(body.fullName).toBe('E2E Test User');
    expect(body.id).toBeDefined();
  });

  it('POST /users should reject duplicate email (409)', async () => {
    const email = `e2e-dup-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'First User' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Second User' })
      .expect(409);
  });

  it('POST /users should reject invalid email (400)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'not-an-email', fullName: 'Bad Email User' })
      .expect(400);
  });
});
